import {BaseRequest} from '../../common/request';
import {Asset, CreateAssetFromApiResponse} from '../../model/asset';

export interface IAssetUploadedInformationArgs {
	assets: Asset[];
}

export class AssetUploadedInformation extends BaseRequest<IAssetUploadedInformationArgs, Asset[]> {

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
			SearchName: 'GetAssetUploadedInformation',
			assetItemid: [],
			assetItemid_type_multiids: '1',
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {

		payload.assetItemid = payload.assets.map((thisAsset: any) => thisAsset.id).join(',');
		payload.assets = undefined;

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any): Asset[] {
		return response.items.map(CreateAssetFromApiResponse);
	}

}
