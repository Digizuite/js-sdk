import {BaseRequest} from '../../common/request';

export class CheckIn extends BaseRequest<any> {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}ItemControlService.js`;
	}
	
	/**
	 * default parameters
	 * @returns {{method: string, itemId: null, note: null}}
	 */
	get defaultPayload() {
		return {
			
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method : 'CheckIn',
			
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
    processRequestData(payload: any) {
		
		payload.itemId = payload.asset.id;
		payload.asset  = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
    processResponseData(response: any) {
		return response.result;
	}

}