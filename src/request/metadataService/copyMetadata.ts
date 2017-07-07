import {BaseRequest} from '../../common/request';

export class CopyMetadata extends BaseRequest {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args = {}) {
		super(args);
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}MetadataService.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method           : 'CopyMetadata',
			copyDeps         : 1,
			copyUniqueVersion: 1,
			sourceItemId     : null,
			targetItemId     : null
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		payload.sourceItemId = payload.ticket.asset.id;
		payload.targetItemId = payload.ticket.itemId;
		
		payload.ticket = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 */
	processResponseData() {
		return {};
	}
	
}