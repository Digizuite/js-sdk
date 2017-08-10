import {BaseRequest} from '../../common/request';
import {Lock} from '../../model/lock';

export class LockInformation extends BaseRequest {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}ItemControlService.js`;
	}
	
	/**
	 * default parameters
	 * @returns {{method: string, itemId: null}}
	 */
	get defaultPayload() {
		return {
			
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method : 'GetLockingInfo',
			
			// These parameters should be specified manually
			itemId: null,
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
		return Lock.createFromAPIResponse(response.result);
	}

}