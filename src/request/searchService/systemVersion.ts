import {BaseRequest} from '../../common/request';

export class SystemVersion extends BaseRequest<any, any> {

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
			method: 'GetSystemVersion',
			page: 1,
			limit: 25,
			start: 0,
		};
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {
		return response.result;
	}
}
