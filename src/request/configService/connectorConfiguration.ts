import {BaseRequest} from '../../common/request';

export class ConnectorConfiguration extends BaseRequest<any> {

	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		const baseEndpoint = this.apiUrl.replace('/dmm3bwsv3/', '/');
		return `${baseEndpoint}Config.aspx`;
	}

	/**
	 * default params
	 * @returns {{SearchName: string, page: number, limit: number}}
	 */
	get defaultPayload() {
		return {};
	}

}
