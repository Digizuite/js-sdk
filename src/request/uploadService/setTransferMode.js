import {BaseRequest} from 'common/request';

export class SetTransferMode extends BaseRequest {
	
	/**
	 * Transfer mode
	 * @returns {{NONE: number, UNC: number, FTP: number, HTTP: number, DIRECT: number, HTTP_DOWNLOAD: number, DIRECT_COPY: number}}
	 * @constructor
	 */
	static get TRANSFER_MODE() {
		return {
			NONE         : 0,
			UNC          : 1,
			FTP          : 2,
			HTTP         : 3,
			DIRECT       : 4,
			HTTP_DOWNLOAD: 5,
			DIRECT_COPY  : 6,
		};
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
		return `${this.apiUrl}UploadRest.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method      : 'SetTransferMode',
			transferMode: SetTransferMode.TRANSFER_MODE.UNC,
			UploadID    : null
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		// UploadID
		payload.UploadID = payload.uploadId;
		payload.uploadId = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 */
	processResponseData() {
		return {};
	}
	
}