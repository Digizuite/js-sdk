import { Asset } from 'src/model/asset';
import {BaseRequest} from '../../common/request';

export interface PublishStatusResponse {
	id: number;
	published: boolean;
}

export interface IPublishStatusArgs {
	assets: Asset[];
}

export class PublishStatus extends BaseRequest<IPublishStatusArgs, PublishStatusResponse[]> {

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
		// https://local.dev.digizuite.com/dev/apiproxy/SearchService.js
		//  ?searchName=Digizuite_Publishing_Status
		//  &limit=9999
		//  &page=1
		//  &assetItemid=9118
		//  &layoutfolderid=125
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			SearchName: 'Digizuite_Publishing_Status',
			assetItemid: null,
			assetItemid_type_multiids: 1,
			limit: 99999,
			page: 1,
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
	protected processResponseData(response: any) {
		return response.items.map((thisItem: any) => {
			return {
				id: parseInt(thisItem.itemId, 10),
				published: !parseInt(thisItem.PublishInProgress, 10),
			};
		});
	}

}
