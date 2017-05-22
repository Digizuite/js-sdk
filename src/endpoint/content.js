import {Endpoint} from 'common/endpoint';
import {Folders} from 'request/searchService/folders';
import {Filters} from 'request/searchService/filters';
import {Assets} from 'request/searchService/assets';
import upperFirst from 'lodash/upperFirst';

export class Content extends Endpoint {
	
	get SORT_TYPES() {
		if(!this._sortTypes) {
			this._sortTypes = this._parseSortTypes(this.rawSortTypes);
		}
		return this._sortTypes;
	}
	
	/**
	 * Default search
	 * @returns {string}
	 * @constructor
	 */
	get DEFAULT_SEARCH() {
		return 'DigiZuite_System_Framework_Search';
	}
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Object} args.labels - An object of labels
	 * @param {String} args.metafieldLabelId - metafieldLabelId of the menu
	 */
	constructor( args = {}  ) {
		super(args);
		
		this.metafieldLabelId = args.metafieldLabelId;
		this.sLayoutFolderId = args.sLayoutFolderId;
		this.labels = args.labels;
		this.rawSortTypes = args.sortTypes;
		this.defaultSortType = upperFirst(args.defaultSortType);
		
		this.cache  = {
			total : {},
			filters : {},
			facetResult : {}
		};
	}
	
	/**
	 * Return a list of available sort by fields
	 * @returns {Array}
	 */
	getSortBy() {
		return this.SORT_TYPES;
	}
	
	/**
	 * Get a list of folders
	 * @param args
	 * @param {String} [args.path] - Path under which to search for folders
	 * @returns {Promise}
	 */
	getFolders( args = {} ) {
		
		const foldersRequest = new Folders({
			apiUrl : this.apiUrl
		});
		
		return foldersRequest.execute({
			sfMetafieldLabelId : this.metafieldLabelId,
			path : args.path || '/'
		});
	}
	
	/**
	 * Get a list of folders
	 * @param args
	 * @param {String} [args.searchName] - The search for which to obtain the filters
	 * @returns {Promise}
	 */
	getFilters( args = {} ) {
	
		const searchName = args.searchName || this.DEFAULT_SEARCH;
		
		if( this.cache.filters.hasOwnProperty(searchName) ) {
			return Promise.resolve(this.cache.filters[searchName]);
		}
		
		const filtersRequest = new Filters({
			apiUrl : this.apiUrl,
			labels : this.labels
		});
		
		return filtersRequest.execute({
			searchName
		}).then( (response) => {
			this.cache.filters[searchName] = response;
			return response;
		});
		
	}
	
	/**
	 * Get a list of assets
	 * @param args
	 * @param {String} [args.path] - The path holding the assets
	 * @returns {Promise}
	 */
	getAssets( args = {} ) {
		
		const searchName = args.searchName || this.DEFAULT_SEARCH;
		
		const assetsRequest = new Assets({
			apiUrl         : this.apiUrl,
			sLayoutFolderId: this.sLayoutFolderId,
			filters        : this.cache.filters[searchName],
			sortTypes      : this.SORT_TYPES,
			defaultSortType: this.defaultSortType
		});
		
		return assetsRequest.execute(args)
			.then(({assets, facetResult, navigation})=>{
				this.cache.facetResult[ searchName ] = facetResult;
				return {assets, navigation };
			});
	}
	
	/**
	 * Get a list of facet results
	 * @param args
	 * @param {String} [args.searchName] - The path holding the assets
	 * @returns {Object}
	 */
	getFacetResult( args = {} ) {
		const searchName = args.searchName || this.DEFAULT_SEARCH;
		return Promise.resolve(this.cache.facetResult[ searchName ]);
	}
	
	/**
	 * Parses sort types
	 * @param sortTypes
	 * @returns {*|Array}
	 * @private
	 */
	_parseSortTypes( sortTypes= [] ) {
		return sortTypes.map((thisSortType) => {
			const sortParts = thisSortType.split(',');
			return {
				by              : upperFirst(sortParts[0]),
				name            : this.labels[`LBL_CCC_SORT_TYPE_${sortParts[0].toUpperCase()}`],
				defaultDirection: upperFirst(sortParts[1])
			};
		});
	}
}