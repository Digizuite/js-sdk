import {Request} from 'common/request';

export class Assets extends Request {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 *
	 * @returns {{SearchName: string, sLayoutFolderId: null, config: [string], page: number, limit: number}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			SearchName: 'DigiZuite_System_Framework_Search',
			sLayoutFolderId: null,
			
			// Configurations for facet search. This will be appended with other directives as we go along
			config : [ 'facet=true' ],
			
			// Pagination settings - only page should be changed when executing
			// the request, limit should be left on the recommended setting
			page: 1,
			limit: 25
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {

		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		
		let facetResult = null;
		
		if( Array.isArray(response.extra) ) {
			facetResult = response.extra[1].facet_counts.facet_fields;
		}
		
		return {
			assets: response.items.map(this._processAssetResult),
			facetResult
		};
	}
	
	/**
	 * Niceify the result from the folder response
	 * @param thisAsset
	 * @returns {{path: string, name: (string), hasChildren: boolean, writable: boolean}}
	 * @private
	 */
	_processAssetResult(thisAsset) {
		return thisAsset;
	}
	
}