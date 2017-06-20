import {BaseRequest} from '../../common/request';
import {getItemIdFromIdPath} from '../../utilities/helpers/treePath';
import {Asset} from '../../model/asset';

export class Assets extends BaseRequest {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {String} args.sLayoutFolderId - An object of labels
	 * @param {Object} args.filters - An object of labels
	 * @param {Object} args.sortTypes - An object of labels
	 * @param {String} args.defaultSortType - An object of labels
	 */
	constructor( args = {}  ) {
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
			SearchName: 'DigiZuite_System_Framework_Search',
			sLayoutFolderId: null,
			
			// Configurations for facet search. This will be appended with other directives as we go along
			// TO BE re-enabled at a later point
			// config : [
			// 	'facet=true',
			// 	'facet.sort=count',
			// 	'facet.limit=100',
			// 	'facet.field=sAssetType'
			// ],
			
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

		// Weird shit
		payload.sLayoutFolderId = this.sLayoutFolderId;
		
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
		
		// Sorting
		let sortBy = this.defaultSortType;
		let sortDirection = '';
		
		if( payload.hasOwnProperty('sorting') ) {
			if( payload.sorting.hasOwnProperty('by') ) {
				sortBy = payload.sorting.by;
			}
			if( payload.sorting.hasOwnProperty('direction') ) {
				sortDirection = payload.sorting.direction;
			}
		}
		
		// No sort direction provided, fallback to default one
		if( !sortDirection ) {
			const selectedSortType = this.sortTypes.find((thisSortType) => thisSortType.by === sortBy );
			sortDirection = selectedSortType.defaultDirection;
		}
		
		payload.sort = `sort${sortBy}${sortDirection}`;
		payload.sorting = undefined;
		
		// Filters
		if( payload.hasOwnProperty('filters')  ) {
			payload.filters.forEach((thisFilter) => Object.assign(payload, thisFilter.getAsSearchPayload() ));
			payload.filters = undefined;
		}
		
		// Path
		if( payload.hasOwnProperty('path')  ) {
			payload.sMenu = getItemIdFromIdPath(payload.path);
			payload.path  = undefined;
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
			assets     : response.items.map( thisAsset => Asset.createFromAPIResponse(thisAsset)),
			facetResult: Array.isArray(response.extra) && response.extra.length > 1 ? response.extra[1].facet_counts.facet_fields : null
		};
	}
	
}