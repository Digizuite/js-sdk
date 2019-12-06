import {BaseRequest} from '../../common/request';
import {md5} from "../../utilities/helpers/md5";

export interface IUserData {
	memberId: number;
	languageId: number;
	itemid: number;
	accessKey: string;
}

export interface ICreateAccessKeyArgs {
	username: string;
	password: string;
}

export class CreateAccessKey extends BaseRequest<ICreateAccessKeyArgs, IUserData> {

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
			method: 'CreateAccesskey',
			usertype: 2,
			useversionedmetadata: 0,
			page: 1,
			limit: 25,

			// These parameters should be specified manually
			username: '',
			password: '',
		};
	}

	/**
	 * Process login request
	 * @param {Object} payload
	 * @returns {Object}
	 */
	public processRequestData(payload: any): ICreateAccessKeyArgs {

		// MD5 the password
		if (payload.password) {
			payload.password = md5(payload.password);
		}

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	public processResponseData(response: any) {

		const user = response.items[0];

		user.memberId = parseInt(user.memberId, 10);
		user.languageId = parseInt(user.languageId, 10);
		user.itemid = parseInt(user.itemid, 10);

		// We are only interested in the user data
		return user;
	}

}
