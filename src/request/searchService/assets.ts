import {BaseRequest, IBaseRequestArgs} from '../../common/request';
import {ISortType} from '../../endpoint/content';
import {Asset} from '../../model/asset';

export interface IAssetRequestArgs extends IBaseRequestArgs {
	sLayoutFolderId?: string;
	filters?: object;
	sortTypes?: any[];
	defaultSortType?: string;
}

export class Assets extends BaseRequest<any, Asset[]> {
	private sLayoutFolderId?: string;
	private filters?: object;
	private sortTypes?: ISortType[];
	private defaultSortType?: string;

	constructor(args: IAssetRequestArgs) {
		super(args);
		this.sLayoutFolderId = args.sLayoutFolderId;
		this.filters = args.filters;
		this.sortTypes = args.sortTypes;
		this.defaultSortType = args.defaultSortType;
	}

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
			limit: 99999,
			page: 1,

			sAssetItemId: null,
			sAssetItemId_type_multiids: 1,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	public processRequestData(payload: any) {

		payload.sAssetItemId = payload.assets.map((thisAsset: Asset) => thisAsset.id).join(',');
		payload.assets = undefined;

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	public processResponseData(response: any) {
		return response.items.map((thisAsset: any) => {
			const asset = new Asset(thisAsset);
			asset.setValueFromAPI(thisAsset);
			return asset;
		});
	}

}
