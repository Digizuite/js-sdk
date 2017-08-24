import {attachEndpoint, Connector} from '../connector';
import {Endpoint, IEndpointArgs} from '../common/endpoint';
import {Folders} from '../request/searchService/folders';
import {Filters} from '../request/searchService/filters';
import {Assets} from '../request/searchService/assets';
import upperFirst from 'lodash/upperFirst';
import {Folder} from "../model/folder";
import {Filter} from "../model/filter/filter";
import {Asset} from "../model/asset";

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
    facetResult: { [key: string]: any }
}

export interface ISortType {
    by: string;
    name: string;
    defaultDirection: string;
}

export class Content extends Endpoint {
    private metafieldLabelId?: string;
    private sLayoutFolderId: string;
    private labelsPromise: Promise<any>;
    private labels: { [key: string]: string };
    private rawSortTypes: string[];
    private defaultSortType: string;
    private cache: IContentCache;
    private _sortTypes: ISortType[];

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
            total: {},
            filters: {},
            facetResult: {}
        };
    }

    get SORT_TYPES() {
        if (!this._sortTypes) {
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
     * @returns {Promise.<{folders}>}
     */
    getFolders(args: { path: string }): Promise<{ folders: Folder[] }> {

        const foldersRequest = new Folders({
            apiUrl: this.apiUrl
        });

        return foldersRequest.execute({
            sfMetafieldLabelId: this.metafieldLabelId,
            path: args.path || '/'
        }).then(folders => {
            return {folders};
        });
    }

    /**
     * Get a list of folders
     * @param args
     * @param {String} [args.searchName] - The search for which to obtain the filters
     * @returns {Promise}
     */
    getFilters(args: { searchName: string }): Promise<Filter[]> {

        const searchName = args.searchName || this.DEFAULT_SEARCH;

        if (this.cache.filters.hasOwnProperty(searchName)) {
            return Promise.resolve(this.cache.filters[searchName]);
        }

        return this.labelsPromise
            .then(() => {

                const filtersRequest = new Filters({
                    apiUrl: this.apiUrl,
                    labels: this.labels
                });

                return filtersRequest.execute({
                    searchName
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
    getAssets(args: { path?: string, sorting?: { by: string, direction: string }, searchName: string }): Promise<{ assets: Asset[], navigation: { total: number } }> {

        const searchName = args.searchName || this.DEFAULT_SEARCH;

        const assetsRequest = new Assets({
            apiUrl: this.apiUrl,
            sLayoutFolderId: this.sLayoutFolderId,
            // filters        : this.cache.filters[searchName],
            sortTypes: this.SORT_TYPES,
            defaultSortType: this.defaultSortType
        });

        return assetsRequest.execute(args)
            .then(({assets, facetResult, navigation}) => {
                this.cache.facetResult[searchName] = facetResult;
                return {assets, navigation};
            });
    }

    /**
     * Get a list of facet results
     * @param args
     * @param {String} [args.searchName] - The path holding the assets
     * @returns {Object}
     */
    getFacetResult(args: { searchName?: string }) {
        const searchName = args.searchName || this.DEFAULT_SEARCH;
        return Promise.resolve(this.cache.facetResult[searchName]);
    }

    /**
     * Parses sort types
     * @param sortTypes
     * @returns {*|Array}
     * @private
     */
    _parseSortTypes(sortTypes: string[] = []): ISortType[] {
        return sortTypes.map((thisSortType: string) => {
            const sortParts = thisSortType.split(',');
            return {
                by: upperFirst(sortParts[0]),
                name: this.labels[`LBL_CCC_SORT_TYPE_${sortParts[0].toUpperCase()}`],
                defaultDirection: upperFirst(sortParts[1])
            };
        });
    }
}

// Attach endpoint
const name = 'content';
const getter = function (instance: Connector) {
    return new Content({
        apiUrl: instance.apiUrl,
        metafieldLabelId: instance.state.config.PortalMenu.metafieldLabelId,
        sLayoutFolderId: instance.state.config.MainSearchFolderId,
        labelsPromise: instance.config.getAppLabels(),
        sortTypes: instance.state.config.SortTypes,
        defaultSortType: instance.state.config.SortType
    });
};

attachEndpoint({name, getter});

declare module '../connector' {
    interface Connector {
        content: Content
    }
}