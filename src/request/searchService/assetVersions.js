import {BaseRequest} from 'common/request';
import {AssetVersion} from 'model/assetVersion';

export class AssetVersions extends BaseRequest {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {}  ) {
		super(args);
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
			SearchName           : 'DigiZuite_System_Framework_AssetHistory',
			method               : 'GetAssetVersions',
			page                 : 1,
			limit                : 999,
			allowNonVersionAssets: 1,
			assetItemId          : null
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {

		payload.assetItemId = payload.asset.id;
		payload.asset = undefined;
		
		return payload;
	}
	
	/**
	 *
	 * @param response
	 * @returns {AssetVersion[]}
	 */
	processResponseData(response) {
		
		const items = response.items.map( thisAsset => AssetVersion.createFromAPIResponse(thisAsset));
		
		if( items.length > 0 ) {
			items[0].isCurrentVersion = true;
		}
		
		return items;
	}
	
}