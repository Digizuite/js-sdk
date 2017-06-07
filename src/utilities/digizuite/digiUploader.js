import {UploadTicket} from 'model/ticket/uploadTicket';
import {ReplaceTicket} from 'model/ticket/replaceTicket';
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
		
		const requests = [
			setFileNameRequest.execute({uploadId: ticket.uploadId, file: ticket.file}),
			setTransferModeRequest.execute({uploadId: ticket.uploadId})
		];
		
		// When replacing we need 3!! more requests.
		if( ticket instanceof ReplaceTicket) {
			
			const setAssetIdRequest = new SetAssetId({
				apiUrl: this.apiUrl
			});
			
			
			const setMetaSourceRequest = new SetMetaSource({
				apiUrl: this.apiUrl
			});
			
			
			const setArchiveReplaceRequest = new SetArchiveReplace({
				apiUrl: this.apiUrl
			});
			
			requests.push(
				setAssetIdRequest.execute({ uploadId: ticket.uploadId, asset: ticket.asset })
			);
			requests.push(
				setMetaSourceRequest.execute({ uploadId: ticket.uploadId })
			);
			requests.push(
				setArchiveReplaceRequest.execute({ uploadId: ticket.uploadId })
			);
		}
		
		return Promise.all(requests).then(() => {
			return submitUploadRequest.execute({uploadId: ticket.uploadId});
		});
	}
	
	/**
	 * Get upload ID
	 * @param {File} file
	 */
	getUploadId(file) {
		
		if (!(file instanceof File)) {
			throw new Error('_getUploadID expect parameter file to be an instance of File');
		}
		
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
			file
		}).then(result => {
			
			uploadId = result.uploadId;
			
			return itemIdUploadRequest.execute({uploadId});
			
		}).then(({itemId}) => {
			return {itemId, uploadId};
		});
	}
	
}