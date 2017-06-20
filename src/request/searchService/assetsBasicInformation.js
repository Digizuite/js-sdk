import {BaseRequest} from '../../common/request';
import {Asset} from '../../model/asset';

export class AssetsBasicInformation extends BaseRequest {
	
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
			SearchName: 'DigiZuite_System_Video_Basic_Information',
			page: 1,
			limit: 99999,
			sItemId_type_multiids : 1,
			
			sItemId : null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {

		payload.sItemId = payload.assets.map( thisAsset => thisAsset.id ).join(',');
		payload.assets= undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return response.items.map( thisAsset => Asset.createFromAPIResponse(thisAsset));
	}
	
}