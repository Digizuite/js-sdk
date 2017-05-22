import {Request} from 'common/request';

export class Filters extends Request {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Object} args.labels - An object of labels
	 */
	constructor( args = {}  ) {
		super(args);
		
		this.labels = args.labels;
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 * default params
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method    : 'GetVisibleSearchFields',
			searchName: null,
		};
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		// We are only interested in the items
		return response.searchFields.map( this._processFilterResult.bind(this) );
	}
	
	/**
	 * Nice-ify the result
	 * @param thisFilter
	 * @returns {{id: string, name: string, type: string}}
	 * @private
	 */
	_processFilterResult(thisFilter) {
		return {
			id  : thisFilter.parameterName,
			name: this.labels[thisFilter.parameterName],
			type: thisFilter.renderType
		};
	}
	
}