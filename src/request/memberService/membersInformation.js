import {BaseRequest} from 'common/request';
import {Member} from 'model/member';

export class MembersInformation extends BaseRequest {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 *
	 * @returns {{SearchName: string, page: number, limit: number, memberid: null}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			SearchName: 'DigiZuite_System_MemberSearch',
			page      : 1,
			limit     : 999,
			memberid  : null
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		payload.memberid = payload.memberId;
		payload.memberId = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		// We are only interested in the items
		return response.items.map( thisMember => Member.createFromAPIResponse(thisMember));
	}
	
}