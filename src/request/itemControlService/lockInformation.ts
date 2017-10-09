import {BaseRequest} from '../../common/request';
import {Lock} from '../../model/lock';

export class LockInformation extends BaseRequest<any> {

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
			method: 'GetLockingInfo',

			// These parameters should be specified manually
			itemId: null,
		};
	}

	/**
	 * Process login request
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {

		payload.itemId = payload.asset.id;
		payload.asset = undefined;

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any): any {
		const lock = new Lock(response);
		lock.setValueFromAPI(response);
		return lock;
	}

}
