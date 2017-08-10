import {BaseRequest} from '../../common/request';

export class CheckOut extends BaseRequest {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}ItemControlService.js`;
	}
	
	/**
	 * default parameters for the call
	 * @returns {{method: string, itemId: null, note: null}}
	 */
	get defaultPayload() {
		return {
			
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method : 'CheckOut',
			
			// These parameters should be specified manually
			itemId: null,
			note : null
		};
	}
	
	/**
	 * Process login request
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData( payload = {} ) {
		
		payload.itemId = payload.asset.id;
		payload.asset  = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData( response ) {
		return response.result;
	}

}