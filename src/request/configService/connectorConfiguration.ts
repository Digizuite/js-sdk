import {PermissionError} from '../../common/permissionError';
import {BaseRequest} from '../../common/request';
import {RequestError} from '../../common/requestError';
import {ERROR_CODE} from '../../const';

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

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {

		console.debug(response);

		// We are only interested in the user data
		return response;
	}

}
