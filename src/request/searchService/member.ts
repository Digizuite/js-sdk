import {BaseRequest} from '../../common/request';
import {Member as MemberModel} from '../../model/member';

export class Member extends BaseRequest<any> {

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
			limit: 1,
			memberid: null,
			page: 1,
			searchName: 'DigiZuite_System_MemberSearch',
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {

		// id to memberid
		payload.memberid = payload.id;
		payload.id = undefined;

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {
		const member = new MemberModel(response.items[0]);
		member.setValueFromAPI(response);
		return member;
	}
}
