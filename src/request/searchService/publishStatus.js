import {BaseRequest} from '../../common/request';

export class PublishStatus extends BaseRequest {
	
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
		//https://local.dev.digizuite.com/dev/apiproxy/SearchService.js?searchName=Digizuite_Publishing_Status&limit=9999&page=1&assetItemid=9118&layoutfolderid=125
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			SearchName: 'Digizuite_Publishing_Status',
			page: 1,
			limit: 99999,
			assetItemid_type_multiids : 1,
			
			assetItemid : null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		payload.assetItemid = payload.assets.map( thisAsset => thisAsset.id ).join(',');
		payload.assets= undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return response.items.map((thisItem)=>{
			return {
				id : parseInt(thisItem.itemId, 10),
				published : !parseInt(thisItem.PublishInProgress,10),
			};
		});
	}
	
}