import {BaseRequest} from '../../common/request';
import {CreateAssetFromApiResponse} from '../../model/asset';

export class AssetsInformation extends BaseRequest<any> {
	
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
			SearchName: 'GetAssetsById',
			page: 1,
			limit: 99999,
			sAssetItemId_type_multiids : 1,
			
			sAssetItemId : null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
    processRequestData(payload: any) {

        payload.sAssetItemId = payload.assets.map((thisAsset: any) => thisAsset.id).join(',');
		payload.assets= undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
    processResponseData(response: any) {
        return response.items.map(CreateAssetFromApiResponse);
	}
	
}