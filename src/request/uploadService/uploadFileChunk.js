import {BaseRequest} from 'common/request';

export class UploadFileChunk extends BaseRequest {
	
	static get CHUNK_SIZE() {
		return 524288;
	}
	
	static get MAX_UPLOAD_CHUNK_RETRIES() {
		return 10;
	}
	
	/**
	 * C-tor
	 * @param {Object} args
	 */
	constructor( args = {}  ) {
		super(args);
		
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}UploadFileChunk.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			jsonresponse: 1,
			uploadid    : null,
			finished    : null
		};
	}
	
	/**
	 *
	 * @param args
	 */
	uploadFile( args = {} ) {
		
		if(!args.file) {
			throw new Error('Upload expect a file as parameter');
		}
		
		if(!args.uploadId) {
			throw new Error('Upload expect a file as parameter');
		}
		
		return new Promise((resolve, reject) => {
			
			this._uploadChunk({
				file       : args.file,
				uploadId   : args.uploadId,
				chunkIndex : 0,
				retry      : 0,
				totalChunks: args.file.size / UploadFileChunk.CHUNK_SIZE,
				resolve,
				reject
			});
			
		});
	}
	
	/**
	 *
	 * @param args
	 * @private
	 */
	_uploadChunk( args = {} ) {
		
		const startByte = args.chunkIndex * UploadFileChunk.CHUNK_SIZE;
		const endByte = (args.chunkIndex + 1) * UploadFileChunk.CHUNK_SIZE;
		
		const blob = args.file.slice(startByte, endByte);
		
		// Upload a chunk
		this.execute(
			{
				uploadId : args.uploadId,
				finished : args.chunkIndex >= args.totalChunks - 1
			},
			blob
		)
			// Move to the next chunk if OK
			.then(()=>{
				
				if (args.chunkIndex >= args.totalChunks - 1) {
					args.resolve({ file : args.file, uploadId : args.uploadId });
				} else {
					
					args.chunkIndex += 1;
					args.retry = 0;
					
					this._uploadChunk(args);
				}
			
			})
			
			// Retry to upload chunk
			.catch(()=>{
				
				if ( args.retry < UploadFileChunk.MAX_UPLOAD_CHUNK_RETRIES) {
			
					args.retry += 1;
					this._uploadChunk(args);
					
				} else {
					args.reject();
				}
			
			});
	}
	
	/**
	 *
	 * @param payload
	 * @param blob
	 * @returns {Promise}
	 */
	execute( payload = {}, blob ) {
		
		// Merge the payload with the default one and pass it though the pre-process
		const requestData = this.processRequestData(
			Object.assign({}, this.defaultPayload, payload)
		);
		
		return new Promise((resolve, reject)=>{
			
			const url= `${this.endpointUrl}?${this.toQueryString(requestData)}`;
			
			const xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-Type', 'application/octet-stream');
			
			xhr.onload = resolve;
			xhr.onerror = reject;
			
			// Send the request to the server
			xhr.send( blob );
		});
		
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		// UploadID
		payload.uploadid = payload.uploadId;
		payload.uploadId = undefined;
		
		// File name
		payload.finished = payload.finished ? 1 : 0;
		
		return payload;
	}
	
	/**
	 * Process response
	 */
	processResponseData() {
		return {};
	}
	
}