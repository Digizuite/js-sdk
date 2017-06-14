import {UploadTicket} from 'model/ticket/uploadTicket';
import {ReplaceTicket} from 'model/ticket/replaceTicket';
import {RestoreTicket} from 'model/ticket/restoreTicket';
import {CopyMetadata} from 'request/metadataService/copyMetadata';
import {CreateUpload} from 'request/uploadService/createUpload';
import {ItemIdUpload} from 'request/uploadService/itemIdUpload';
import {SetFileName} from 'request/uploadService/setFileName';
import {SetTransferMode} from 'request/uploadService/setTransferMode';
import {SetAssetId} from 'request/uploadService/setAssetId';
import {SetMetaSource} from 'request/uploadService/setMetaSource';
import {SetArchiveReplace} from 'request/uploadService/setArchiveReplace';
import {SubmitUpload} from 'request/uploadService/submitUpload';
import {UploadFileChunk} from 'request/uploadService/uploadFileChunk';
import {FinishUpload} from 'request/uploadService/finishUpload';
import {greaterOrEqualThan} from 'utilities/damVersionCompare';

export class DigiUploader {
	
	get SUPPORTS_FAST_FINISH_UPLOAD() {
		return greaterOrEqualThan(this.apiVersion, '4.7.1');
	}
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {string} args.computerName
	 */
	constructor(args = {}) {
		this.computerName = args.computerName;
		this.apiUrl = args.apiUrl;
		this.apiVersion = args.apiVersion;
	}
	
	/**
	 * Upload a file
	 * @param {UploadTicket} ticket
	 */
	uploadFile(ticket) {
		
		if (!(ticket instanceof UploadTicket)) {
			throw new Error('Upload expect an upload ticket as parameter');
		}
		
		this.fileChunkUploader = new UploadFileChunk({
			apiUrl: this.apiUrl
		});
		
		return this.fileChunkUploader.uploadFile(ticket);
		
	}
	
	/**
	 * Finishes an upload.
	 * Determines which version of finish upload to use based on DAM version
	 * @param {UploadTicket|ReplaceTicket} ticket
	 */
	finishUpload(ticket) {
		
		return this.SUPPORTS_FAST_FINISH_UPLOAD ?
			this._finishUploadFast(ticket) :
			this._finishUploadSlow(ticket);
	
	}
	
	
	/**
	 * Finishes an upload, the fast way.
	 * @param {UploadTicket|ReplaceTicket} ticket
	 */
	_finishUploadFast( ticket ) {
		
		let preFinishPromise;
		
		// When restoring an asset, we also need to restore its metadata
		if( ticket instanceof RestoreTicket ) {
			const copyMetadataRequest = new CopyMetadata({
				apiUrl: this.apiUrl
			});
			
			preFinishPromise = copyMetadataRequest.execute({ ticket });
		} else {
			preFinishPromise = Promise.resolve();
		}
		
		const setFinishUploadRequest = new FinishUpload({
			apiUrl: this.apiUrl
		});
		
		// No one knows copyMetadata needs to be ran or not before submitting the upload.
		// Historically speaking, it was used before, but again, no one knows!!
		// Let's just play it safe...
		return preFinishPromise.then(()=> setFinishUploadRequest.execute({ ticket }));
	}
	
	/**
	 * Finishes an upload, the slow way.
	 * @param {UploadTicket|ReplaceTicket} ticket
	 */
	_finishUploadSlow(ticket) {
		const setFileNameRequest = new SetFileName({
			apiUrl: this.apiUrl
		});
		
		const setTransferModeRequest = new SetTransferMode({
			apiUrl: this.apiUrl
		});
		
		const submitUploadRequest = new SubmitUpload({
			apiUrl: this.apiUrl
		});
		
		// Valid for all uploads
		const requests = [
			setFileNameRequest.execute({ ticket }),
			setTransferModeRequest.execute({ ticket })
		];
		
		// Common for restore or replace
		if(
			(ticket instanceof ReplaceTicket) ||
			(ticket instanceof RestoreTicket)
		) {
			
			const setAssetIdRequest = new SetAssetId({
				apiUrl: this.apiUrl
			});
			
			const setArchiveReplaceRequest = new SetArchiveReplace({
				apiUrl: this.apiUrl
			});
			debugger;
			requests.push(
				setAssetIdRequest.execute({ ticket })
			);
			
			requests.push(
				setArchiveReplaceRequest.execute({ uploadId: ticket.uploadId })
			);
		}
		
		// Specific to replace
		if(
			(ticket instanceof ReplaceTicket) &&
			!(ticket instanceof RestoreTicket)
		) {
			const setMetaSourceRequest = new SetMetaSource({
				apiUrl: this.apiUrl
			});
			
			requests.push(
				setMetaSourceRequest.execute({ uploadId: ticket.uploadId })
			);
		}
		
		// Specific to restore
		if( ticket instanceof RestoreTicket ) {
			const copyMetadataRequest = new CopyMetadata({
				apiUrl: this.apiUrl
			});
			
			requests.push(
				copyMetadataRequest.execute({ ticket })
			);
		}
		
		// Submit!
		return Promise.all(requests).then(() => {
			return submitUploadRequest.execute({uploadId: ticket.uploadId});
		});
	}
	
	/**
	 * Get upload ID
	 * @param {Object} args
	 * @param {File} [args.file]
	 * @param {String} [args.filename]
	 * @param {String} [args.name]
	 * @returns {Promise.<Object>}
	 */
	getUploadIds( args = {} ) {
		
		const createUploadRequest = new CreateUpload({
			apiUrl: this.apiUrl
		});
		
		// Create an upload request
		return createUploadRequest.execute({
			computerName: this.computerName,
			file        : args.file,
			filename    : args.filename,
			name        : args.name
		}).then( createUploadResult => {
			
			// In DAM 4.8.0 or earlier, itemId was set to 0.
			// Which required an additional request to be made
			if( createUploadResult.itemId ) {
				return createUploadResult;
			} else {
				return this._getUploadIdsFromUploadId( createUploadResult.uploadId );
			}
			
		});
	}
	
	/**
	 * Returns itemId and uploadID from an uploadId
	 * @param uploadId
	 * @returns {Promise.<Object>}
	 * @private
	 */
	_getUploadIdsFromUploadId( uploadId ) {
		
		const itemIdUploadRequest = new ItemIdUpload({
			apiUrl: this.apiUrl
		});
		
		return itemIdUploadRequest.execute({
			uploadId: uploadId
		}).then( ({itemId}) => {
			return { itemId,  uploadId };
		});
		
	}
	
}