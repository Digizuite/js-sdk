import {BaseRequest} from '../../common/request';
import {LogWarn} from '../../utilities/logger';
import {StringInformationItem} from '../../model/information/stringInformationItem';
import {LongInformationItem} from '../../model/information/longInformationItem';
import {ArrayInformationItem} from '../../model/information/arrayInformationItem';
import {DateTimeInformationItem} from '../../model/information/dateTimeInformationItem';
import {IntInformationItem} from '../../model/information/intInformationItem';
import {BoolInformationItem} from '../../model/information/boolInformationItem';

export class AssetInformation extends BaseRequest {
	
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
			SearchName: 'DigiZuite_System_Framework_AssetInfo',
			method: 'GetAssetInfo',
			itemIds : null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {

		payload.itemIds = payload.assets.map( thisAsset => thisAsset.id ).join(',');
		payload.assets = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		const assetInformation = response.items
			.map( (thisItem) => {
				
				const informationItems = thisItem.valueFields
					.map( this._createInformationItem )
					.filter( thisInfoItem => thisInfoItem );
				
				return {
					id : thisItem.itemId,
					informationItems
				};
			});
		
		return { assetInformation };
	}
	
	/**
	 * Transforms the API response in an instance of a information type
	 * @param thisItem
	 * @returns {*}
	 * @private
	 */
	_createInformationItem(thisItem) {
		let result;
		
		// Yeahhh... no...
		switch (thisItem.type) {
			
			case StringInformationItem.TYPE:
				result = StringInformationItem.createFromAPIResponse(thisItem);
				break;
				
			case BoolInformationItem.TYPE:
				result = BoolInformationItem.createFromAPIResponse(thisItem);
				break;
				
			case IntInformationItem.TYPE:
				result = IntInformationItem.createFromAPIResponse(thisItem);
				break;
				
			case LongInformationItem.TYPE:
				result = LongInformationItem.createFromAPIResponse(thisItem);
				break;
			
			case ArrayInformationItem.TYPE:
				result = ArrayInformationItem.createFromAPIResponse(thisItem);
				break;
			
			case DateTimeInformationItem.TYPE:
				result = DateTimeInformationItem.createFromAPIResponse(thisItem);
				break;
				
			default:
				// Lol
				LogWarn('Unknown information type', thisItem);
				break;
		}
		
		return result;
	}
	
}