import {BaseRequest} from '../../common/request';
import {CreateAssetFromApiResponse} from '../../model/asset';

export class AssetsBasicInformation extends BaseRequest<any> {

	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}

	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			SearchName: 'DigiZuite_System_Video_Basic_Information',
			page: 1,
			limit: 99999,
			sItemId_type_multiids: 1,

			sItemId: null,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {

		payload.sItemId = payload.assets.map((thisAsset: any) => thisAsset.id).join(',');
		payload.assets = undefined;

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {
		return response.items.map(CreateAssetFromApiResponse);
	}

}
