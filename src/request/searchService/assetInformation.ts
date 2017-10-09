import {BaseRequest} from '../../common/request';
import {ArrayInformationItem} from '../../model/information/arrayInformationItem';
import {AssetInformation as AssetInformationModel} from "../../model/information/assetInformation";
import {BoolInformationItem} from '../../model/information/boolInformationItem';
import {DateTimeInformationItem} from '../../model/information/dateTimeInformationItem';
import {InformationItem} from '../../model/information/informationItem';
import {IntInformationItem} from '../../model/information/intInformationItem';
import {LongInformationItem} from '../../model/information/longInformationItem';
import {StringInformationItem} from '../../model/information/stringInformationItem';
import {LogWarn} from '../../utilities/logger';

export class AssetInformation extends BaseRequest<any> {

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
			itemIds: null,
			method: 'GetAssetInfo',
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {

		payload.itemIds = payload.assets.map((thisAsset: any) => thisAsset.id).join(',');
		payload.assets = undefined;

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {
		const assetInformation = response.items
			.map((thisItem: any) => {

				const informationItems = thisItem.valueFields
					.map(this._createInformationItem)
					.filter((thisInfoItem: any) => thisInfoItem);

				return new AssetInformationModel({
					assetId: thisItem.itemId,
					informationItems,
				});

			});

		return {assetInformation};
	}

	/**
	 * Transforms the API response in an instance of a information type
	 */
	private _createInformationItem(thisItem: any): InformationItem | null {
		let result: InformationItem;

		// Yeahhh... no...
		switch (thisItem.type) {

			case StringInformationItem.TYPE:
				result = new StringInformationItem(thisItem);
				break;

			case BoolInformationItem.TYPE:
				result = new BoolInformationItem(thisItem);
				break;

			case IntInformationItem.TYPE:
				result = new IntInformationItem(thisItem);
				break;

			case LongInformationItem.TYPE:
				result = new LongInformationItem(thisItem);
				break;

			case ArrayInformationItem.TYPE:
				result = new ArrayInformationItem(thisItem);
				break;

			case DateTimeInformationItem.TYPE:
				result = new DateTimeInformationItem(thisItem);
				break;

			default:
				// Lol
				LogWarn('Unknown information type', thisItem);
				return null;
		}

		result.setValueFromAPI(thisItem);

		return result;
	}

}
