import {BaseRequest} from '../../common/request';
import {md5} from "../../utilities/helpers/md5";

export interface IAccessKeyData {
	memberId: number;
	languageId: number;
	accessKey: string;
}

export class SetAccessKeyOptions extends BaseRequest<any, IAccessKeyData> {

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
			method: 'LogOnAccessKeyOptions',

			// These parameters should be specified manually
			options: null,
			accesskey: null,
		};
	}

	/**
	 * Process login request
	 * @param {Object} payload
	 * @returns {Object}
	 */
	public processRequestData(payload: any) {

		payload.options = JSON.stringify({
			'dez.configversionid': payload.versionId,
			'dez.dataversionid': payload.versionId,
			'dez.useversionedmetadata': 0,
			'dez.setmembersystemlanguage': payload.languageId,
		});

		delete payload.languageId;
		delete payload.versionId;

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	public processResponseData(response: any) {

		const data = response.items[0];

		data.memberId = parseInt(data.memberId, 10);
		data.languageId = parseInt(data.languageId, 10);

		// We are only interested in the user data
		return data;
	}

}
