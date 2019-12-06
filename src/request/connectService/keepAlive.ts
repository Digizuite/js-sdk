import {BaseRequest} from '../../common/request';
import {IUserData} from "./createAccessKey";

export class KeepAlive extends BaseRequest<any, IUserData> {

	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}ConnectService.js`;
	}

	/**
	 * default params
	 * @returns {{method: string}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method: 'IsLoggedIn',
			accessKey: null,
		};
	}

	/**
	 * Process response
	 * @param response
	 */
	public processResponseData(response: any) {
		return {
			memberId: parseInt(response.memberId, 10),
			languageId: parseInt(response.languageId, 10),
			itemid: parseInt(response.memberItemid, 10),
			accessKey: this.accessKey,
		};
	}

}
