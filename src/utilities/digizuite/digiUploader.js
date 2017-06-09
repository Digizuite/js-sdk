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

export class DigiUploader {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {string} args.computerName
	 */
	constructor(args = {}) {
		this.computerName = args.computerName;
		this.apiUrl = args.apiUrl;
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
	 * Finishes an upload
	 * @param {UploadTicket|ReplaceTicket} ticket
	 */
	finishUpload(ticket) {
		
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
			
			requests.push(
				setAssetIdRequest.execute({ ticket })
			);
			
			requests.push(
				setArchiveReplaceRequest.execute({ uploadId: ticket.uploadId })
			);
		}
		
		// Specific to replace
		if( ticket instanceof ReplaceTicket ) {
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
	 */
	getUploadId( args = {} ) {
		
		const createUploadRequest = new CreateUpload({
			apiUrl: this.apiUrl
		});
		
		const itemIdUploadRequest = new ItemIdUpload({
			apiUrl: this.apiUrl
		});
		
		let uploadId;
		
		// Create an upload request
		return createUploadRequest.execute({
			computerName: this.computerName,
			file        : args.file,
			filename    : args.filename,
			name        : args.name
		}).then(result => {
			
			uploadId = result.uploadId;
			
			return itemIdUploadRequest.execute({uploadId});
			
		}).then(({itemId}) => {
			return {itemId, uploadId};
		});
	}
	
}