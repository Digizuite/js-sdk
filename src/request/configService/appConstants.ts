import {BaseRequest, HTTP_Method} from '../../common/request';
import {IConstants} from "../../model/constants";
import {ensureTrailingSeparator} from "../../utilities/helpers/url";

export class AppConstants extends BaseRequest<any, IConstants> {

	get method() {
		return HTTP_Method.Get;
	}

	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}api/config`;
	}

	/**
	 * default params
	 * @returns {{SearchName: string, page: number, limit: number}}
	 */
	get defaultPayload() {
		return {};
	}

	protected processResponseData(response: IConstants): IConstants {
		response.baseApiUrl = ensureTrailingSeparator(response.baseApiUrl);
		response.loginServiceUrl = ensureTrailingSeparator(response.loginServiceUrl);
		return response;
	}
}
