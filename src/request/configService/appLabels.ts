import {BaseRequest} from '../../common/request';

export class AppLabels extends BaseRequest<any, any> {

	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}ConfigService.js`;
	}

	/**
	 *
	 * @returns {{method: string, page: number, limit: number, start: number}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method: 'GetLabels',
			page: 1,
			limit: 25,
			start: 0,

			languageId: null,
			versionId: null,
		};
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {

		const cleanResponse: any = {};

		response.items.forEach((thisLabel: any) => {
			cleanResponse[thisLabel.labelConstant] = thisLabel.label;
		});

		return cleanResponse;
	}

}
