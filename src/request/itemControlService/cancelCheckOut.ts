import {BaseRequest} from '../../common/request';

export class CancelCheckOut extends BaseRequest<any> {

	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}ItemControlService.js`;
	}

    /**
	 * default parameters
     */
	get defaultPayload() {
		return {
			// These parameters should be specified manually
            method: null,
            itemId: null,
			note: null,
		};
	}

	/**
	 * Process login request
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {

		payload.method = payload.force ? 'ForceCancelCheckOut' : 'CancelCheckOut';
		payload.itemId = payload.asset.id;

		payload.asset = undefined;
		payload.force = undefined;

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {
		return response.result;
	}

}
