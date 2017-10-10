import {BaseRequest, IBaseRequestArgs} from '../../common/request';
import {Filter} from "../../model/filter/filter";
import {StringFilter} from "../../model/filter/stringFilter";
import {LogWarn} from '../../utilities/logger';
import {AssetTypeFilter} from "../../model/filter/assetTypeFilter";

export class Filters extends BaseRequest<any> {

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Object} args.labels - An object of labels
	 */
	constructor(args: IBaseRequestArgs) {
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
	 * default params
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method: 'GetVisibleSearchFields',
			searchName: null,
		};
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {
        return response.searchFields
            .map(this._createFilter)
            .filter((thisFilter: any) => thisFilter);
	}

    /**
	 * Create a filter
     * @param thisFilter
     * @returns {Filter<any>}
     * @private
     */
	protected _createFilter(thisFilter: any) : Filter<any> | null {

		let result : Filter<any>;

        switch (thisFilter.renderType) {

			case StringFilter.TYPE:
				result = new StringFilter({});
				break;

            case AssetTypeFilter.TYPE:
                result = new AssetTypeFilter({});
                break;

            default:
                // Lol
                LogWarn('Unknown filter type', thisFilter);
                return null;
        }

        result.setValueFromAPI(thisFilter);

        return result;
	}
}
