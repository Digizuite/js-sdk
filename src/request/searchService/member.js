import {BaseRequest} from '../../common/request';
import { Member as MemberModel } from '../../model/member';

export class Member extends BaseRequest {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 * default params
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			searchName: 'DigiZuite_System_MemberSearch',
			page : 1,
			limit: 1,
			
			memberid : null
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		// id to memberid
		payload.memberid = payload.id;
		payload.id = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return MemberModel.createFromAPIResponse(response.items[0]);
	}
}