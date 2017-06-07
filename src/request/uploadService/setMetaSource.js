import {BaseRequest} from 'common/request';

export class SetMetaSource extends BaseRequest {
	
	/**
	 *
	 * @returns {{FROM_UPLOAD: number, FROM_ASSET: number}}
	 * @constructor
	 */
	static get META_SOURCE() {
		return {
			FROM_UPLOAD : 0,
			FROM_ASSET : 1,
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
			method    : 'SetMetaSource',
			metaSource: SetMetaSource.META_SOURCE.FROM_ASSET,
			UploadID  : null,
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