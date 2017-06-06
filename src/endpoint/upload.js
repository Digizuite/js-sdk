import {Endpoint} from 'common/endpoint';
import {UploadTicket} from 'model/uploadTicket';
import {CreateUpload} from 'request/uploadService/createUpload';
import {ItemIdUpload} from 'request/uploadService/itemIdUpload';
import {SetFileName} from 'request/uploadService/setFileName';
import {SetTransferMode} from 'request/uploadService/setTransferMode';
import {SubmitUpload} from 'request/uploadService/submitUpload';
import {UploadFileChunk} from 'request/uploadService/uploadFileChunk';

export class Upload extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 */
	constructor(args = {}) {
		super(args);
		this.computerName = args.computerName;
	}
	
	/**
	 *
	 * @param args
	 * @returns {Promise.<array>}
	 */
	requestUploadTickets( args = {} ) {
		return Promise.all(
			args.files.map( thisFile => this._getUploadId(thisFile) )
		).then((results)=>{
			return results.map( (thisResult, index) => {
				return new UploadTicket({
					uploadId : thisResult.uploadId,
					itemId : thisResult.itemId,
					file : args.files[index]
				});
			} );
		});
	}
	
	/**
	 * Upload a file
	 * @param {Object} args
	 * @param args.file
	 */
	_uploadAsset( args = {} ) {
	
		if(!args.file) {
			throw new Error('Upload expect a file as parameter');
		}
		
		let itemId;
		
		return this._getUploadId(args.file)
			.then((result) => { itemId = result.itemId; return result; })
			.then((result) => this._uploadFile({ uploadId : result.uploadId, file : args.file }) )
			.then((result) => this._finishUpload({ uploadId : result.uploadId, file : args.file }) )
			.then(() => { return { itemId }; } );
	}
	
	/**
	 * Upload a file
	 * @param args
	 * @private
	 */
	_uploadFile( args = {} ) {
		
		if(!args.file) {
			throw new Error('Upload expect a file as parameter');
		}
		
		if(!args.uploadId) {
			throw new Error('Upload expect a file as parameter');
		}
		
		this.fileChunkUploader = new UploadFileChunk({
			apiUrl : this.apiUrl
		});
		
		return this.fileChunkUploader.uploadFile({
			file : args.file,
			uploadId : args.uploadId
		});
		
	}
	
	/**
	 * Finishes an upload
	 * @param args
	 * @private
	 */
	_finishUpload( args = {} ) {
	
		const setFileNameRequest = new SetFileName({
			apiUrl : this.apiUrl
		});

		const setTransferModeRequest = new SetTransferMode({
			apiUrl : this.apiUrl
		});

		const submitUploadRequest = new SubmitUpload({
			apiUrl : this.apiUrl
		});

		return Promise.all([
			setFileNameRequest.execute({ uploadId : args.uploadId, file : args.file }),
			setTransferModeRequest.execute({ uploadId : args.uploadId }),
		]).then(()=>{
			return submitUploadRequest.execute({ uploadId : args.uploadId });
		});
	}
	
	/**
	 * Get upload ID
	 * @param file
	 * @private
	 */
	_getUploadId( file ) {
		
		const createUploadRequest = new CreateUpload({
			apiUrl : this.apiUrl
		});
		
		const itemIdUploadRequest = new ItemIdUpload({
			apiUrl : this.apiUrl
		});
		
		// Create an upload request
		return createUploadRequest.execute({
			computerName: this.computerName,
			file        : file
		}).then(( { uploadId } )=>{
			
			return itemIdUploadRequest.execute({
				uploadId
			}).then(({itemId}) => { return {itemId, uploadId}; });
			
		});
	}
	
}