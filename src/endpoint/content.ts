import upperFirst from 'lodash-es/upperFirst';
import {AssetInformation} from 'src/request/searchService/assetInformation';
import {Endpoint, IEndpointArgs} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {Asset} from "../model/asset";
import {Filter} from "../model/filter/filter";
import {Folder} from "../model/folder";
import {InformationItem} from '../model/information/informationItem';
import {Assets} from '../request/searchService/assets';
import {Filters} from '../request/searchService/filters';
import {Folders} from '../request/searchService/folders';
import {FrameworkSearch} from '../request/searchService/frameworkSearch';

export interface IContentEndpointArgs extends IEndpointArgs {
	labels?: { [key: string]: string };
	metafieldLabelId?: string;
	sLayoutFolderId: string;
	labelsPromise: Promise<any>;
	sortTypes: any;
	defaultSortType: string;
}

export interface IContentCache {
	total: { [key: string]: any };
	filters: { [key: string]: Filter[] };
	facetResult: { [key: string]: any };
}

export interface ISortType {
	by: string;
	name: string;
	defaultDirection: string;
}

export interface IGetAssetArgs {
	path?: string;
	sorting?: { by: string, direction: string };
	searchName?: string;
	navigation?: { page?: number, limit: number };
	filters?: Filter[];
}

export class Content extends Endpoint {
	private metafieldLabelId?: string;
	private sLayoutFolderId: string;
	private labelsPromise: Promise<any>;
	private labels: { [key: string]: string };
	private rawSortTypes: string[];
	private defaultSortType: string;
	private cache: IContentCache;
	private sortTypes: ISortType[];

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Object} args.labels - An object of labels
	 * @param {String} args.metafieldLabelId - metafieldLabelId of the menu
	 */
	constructor(args: IContentEndpointArgs) {
		super(args);

		this.metafieldLabelId = args.metafieldLabelId;
		this.sLayoutFolderId = args.sLayoutFolderId;
		this.labelsPromise = args.labelsPromise;
		this.labels = {};
		this.rawSortTypes = args.sortTypes;
		this.defaultSortType = upperFirst(args.defaultSortType);

		this.labelsPromise.then((labels) => {
			this.labels = labels;
		});

		this.cache = {
			facetResult: {},
			filters: {},
			total: {},
		};
	}

	get SORT_TYPES() {
		if (!this.sortTypes) {
			this.sortTypes = this._parseSortTypes(this.rawSortTypes);
		}
		return this.sortTypes;
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
	 * Return a list of available sort by fields
	 * @returns {Array}
	 */
	public getSortBy() {
		return this.SORT_TYPES;
	}

	/**
	 * Get a list of folders
	 * @param args
	 * @param {String} [args.path] - Path under which to search for folders
	 * @returns {Promise.<{folders}>}
	 */
	public getFolders(args: { path: string }): Promise<{ folders: Folder[] }> {

		const foldersRequest = new Folders({
			apiUrl: this.apiUrl,
		});

		return foldersRequest.execute({
			path: args.path || '/',
			sfMetafieldLabelId: this.metafieldLabelId,
		}).then((folders) => {
			return {folders};
		});
	}

	/**
	 * Get a list of folders
	 * @param args
	 * @param {String} [args.searchName] - The search for which to obtain the filters
	 * @returns {Promise}
	 */
	public getFilters(args: { searchName?: string } = {}): Promise<Filter[]> {

		const searchName = args.searchName || this.DEFAULT_SEARCH;

		if (this.cache.filters.hasOwnProperty(searchName)) {
			return Promise.resolve(this.cache.filters[searchName]);
		}

		return this.labelsPromise
			.then(() => {

				const filtersRequest = new Filters({
					apiUrl: this.apiUrl,
					labels: this.labels,
				});

				return filtersRequest.execute({
					searchName,
				});

			}).then((response) => {
				this.cache.filters[searchName] = response;
				return response;
			});

	}

	/**
	 * Get a list of assets
	 * @param args
	 * @param {String} [args.path] - The path holding the assets
	 * @param {object} [args.sorting] - The sorting to apply
	 * @param {string} [args.sorting.by] - The value to sort by
	 * @param {string} [args.sorting.direction] - The sorting direction
	 * @returns {Promise.<{assets, navigation}>}
	 */
	public getAssets(args: IGetAssetArgs = {}): Promise<{ assets: Asset[], navigation: { total: number } }> {

		const searchName = args.searchName || this.DEFAULT_SEARCH;

		const frameworkSearchRequest = new FrameworkSearch({
			apiUrl: this.apiUrl,
			sLayoutFolderId: this.sLayoutFolderId,
			// filters        : this.cache.filters[searchName],
			sortTypes: this.SORT_TYPES,
			defaultSortType: this._parseSortType(this.defaultSortType),
		});

		return frameworkSearchRequest.execute(args)
			.then(({assets, facetResult, navigation}) => {
				this.cache.facetResult[searchName] = facetResult;
				return {assets, navigation};
			});
	}

	/**
	 *
	 * @param args
	 * @param {Number[]} [args.assetIds] -  a list of assets ids
	 * @returns {Promise.<Asset[]>}
	 */
	public getAssetsById(args: { assetIds: number[] }) {

		if (!Array.isArray(args.assetIds)) {
			throw new Error('Expecting as array of assets ids as parameter');
		}

		const assetRequest = new Assets({
			apiUrl: this.apiUrl,
		});

		return assetRequest.execute({
			assets: args.assetIds.map((thisAssetId) => new Asset({id: thisAssetId})),
		});

	}


	public getAssetsInformation(args: { assets: Asset[] }): Promise<InformationItem[]> {

		if (!Array.isArray(args.assets)) {
			throw new Error('Expecting an array of assets as parameter');
		}

		const assetInformationRequest = new AssetInformation({
			apiUrl: this.apiUrl,
		});

		return assetInformationRequest.execute({
			assets: args.assets,
		});
	}

	/**
	 * Get a list of facet results
	 * @param args
	 * @param {String} [args.searchName] - The path holding the assets
	 * @returns {Object}
	 */
	public getFacetResult(args: { searchName?: string } = {}) {
		const searchName = args.searchName || this.DEFAULT_SEARCH;
		return Promise.resolve(this.cache.facetResult[searchName]);
	}

	/**
	 * Parses sort types
	 * @param sortTypes
	 * @returns {*|Array}
	 * @private
	 */
	private _parseSortTypes(sortTypes: string[]) {
		return sortTypes.map((thisSortType) => this._parseSortType(thisSortType));
	}

	/**
	 * Parse a sort type
	 * @param sortType
	 * @private
	 */
	private _parseSortType(sortType: string) {
		const sortParts = sortType.split(',');
		return {
			by: upperFirst(sortParts[0]),
			defaultDirection: upperFirst(sortParts[1]),
			name: this.labels[`LBL_CCC_SORT_TYPE_${sortParts[0].toUpperCase()}`],
		};
	}
}

// Attach endpoint
const name = 'content';
const getter = function (instance: ConnectorType) {
	return new Content({
		apiUrl: instance.apiUrl,
		defaultSortType: instance.state.config.SortType,
		labelsPromise: instance.config.getAppLabels(),
		metafieldLabelId: instance.state.config.PortalMenu.metafieldLabelId,
		sLayoutFolderId: instance.state.config.MainSearchFolderId,
		sortTypes: instance.state.config.SortTypes,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		content: Content;
	}
}
