import {BaseRequest} from '../../common/request';
import {ComboOption} from '../../model/metadata/comboOption';

export class ComboOptions extends BaseRequest {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args = {}) {
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
			searchName        : 'DigiZuite_System_metadatav2_combobox',
			page              : 1,
			limit             : 25,
			sfMetafieldLabelId: null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		payload.sfMetafieldLabelId = payload.metadataItem.labelId;
		payload.metadataItem = undefined;
		
		// Navigation data
		if( payload.hasOwnProperty('navigation') ) {
			
			if( payload.navigation.hasOwnProperty('page') ) {
				payload.page = payload.navigation.page;
			}
			if( payload.navigation.hasOwnProperty('limit') ) {
				payload.limit = payload.navigation.limit;
			}
			
			payload.navigation = undefined;
		}
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return {
			navigation : {total: parseInt(response.total, 10)},
			options     : response.items.map( thisOption => ComboOption.createFromAPIResponse(thisOption)),
		};
	}
	
}