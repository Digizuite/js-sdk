import {Endpoint} from 'common/endpoint';
import {CreateUpload} from 'request/uploadService/createUpload';
import {ItemIdUpload} from 'request/uploadService/itemIdUpload';

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
	 * Upload a file
	 * @param {Object} args
	 * @param args.file
	 */
	uploadAsset( args = {} ) {
	
		if(!args.file) {
			throw new Error('Upload expect a file as parameter');
		}
		
		return this._getUploadId(args.file)
			.then((result) => console.log(result));
	}
	
	/**
	 * Finishes an upload
	 * @param args
	 * @private
	 */
	_finishUpload( args = {} ) {
	
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