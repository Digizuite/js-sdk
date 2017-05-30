import {BaseRequest} from 'common/request';
import {ComboOption} from 'model/metadata/comboOption';

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
			limit             : 8,
			page              : 1,
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