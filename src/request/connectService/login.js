import {BaseRequest} from 'common/request';
import md5 from 'blueimp-md5';

export class Login extends BaseRequest {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}ConnectService.js`;
	}
	
	
	/**
	 * default parameters for the call
	 * @returns {{method: string, usertype: number, page: number, limit: number, username: null, password: null}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method: 'LogOn',
			usertype: 2,
			page: 1,
			limit: 25,
			
			// These parameters should be specified manually
			username: null,
			password: null
		};
	}
	
	/**
	 * Process login request
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData( payload ) {
		
		// MD5 the password
		payload.password = md5(payload.password);
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData( response ) {
		
		const user = response.items[0];
		
		user.memberId = parseInt(user.memberId, 10);
		user.languageId = parseInt(user.languageId, 10);
		user.itemid = parseInt(user.itemid, 10);
		
		// We are only interested in the user data
		return user;
	}

}