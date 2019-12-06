import {BaseRequest} from '../../common/request';
import {AssetVersion, CreateAssetVersionFromApiResponse} from '../../model/assetVersion';

export class AssetVersions extends BaseRequest<any, any> {

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
			SearchName: 'DigiZuite_System_Framework_AssetHistory',
			method: 'GetAssetVersions',
			page: 1,
			limit: 999,
			allowNonVersionAssets: 1,
			assetItemId: null,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {

		payload.assetItemId = payload.asset.id;
		payload.asset = undefined;

		return payload;
	}

	/**
	 *
	 * @param response
	 * @returns {AssetVersion[]}
	 */
	protected processResponseData(response: any) {

		const items = response.items.map(CreateAssetVersionFromApiResponse);

		if (items.length > 0) {
			items[0].isCurrentVersion = true;
		}

		return items;
	}

}
