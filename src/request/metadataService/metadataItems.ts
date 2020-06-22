import {BaseRequest} from '../../common/request';
import {BitMetadataItem} from '../../model/metadata/bitMetadataItem';
import {ComboValueMetadataItem} from '../../model/metadata/comboValueMetadataItem';
import {DateTimeMetadataItem} from '../../model/metadata/dateTimeMetadataItem';
import {EditComboValueMetadataItem} from '../../model/metadata/editComboValueMetadataItem';
import {EditMultiComboValueMetadataItem} from '../../model/metadata/editMultiComboValueMetadataItem';
import {FloatMetadataItem} from '../../model/metadata/floatMetadataItem';
import {IntMetadataItem} from '../../model/metadata/intMetadataItem';
import {LinkMetadataItem} from '../../model/metadata/linkMetadataItem';
import {MasterItemReferenceMetadataItem} from '../../model/metadata/masterItemReferenceMetadataItem';
import {MetadataItem} from "../../model/metadata/metadataItem";
import {MoneyMetadataItem} from '../../model/metadata/moneyMetadataItem';
import {MultiComboValueMetadataItem} from '../../model/metadata/multiComboValueMetadataItem';
import {NoteMetadataItem} from '../../model/metadata/noteMetadataItem';
import {SlaveItemReferenceMetadataItem} from "../../model/metadata/slaveItemReferenceMetadataItem";
import {StringMetadataItem} from '../../model/metadata/stringMetadataItem';
import {TreeMetadataItem} from '../../model/metadata/treeMetadataItem';
import {UniqueVersionMetadataItem} from '../../model/metadata/uniqueVersionMetadataItem';
import {LogWarn} from '../../utilities/logger';

export interface IMetadataItemsPayload {
	id?: string | any;
	language?: string | any;
	assetId?: string | any;
	searchName?: string;
	limit?: number;
	page?: number;
	itemid_note_type_MultiIds?: number | null;
	itemid_value_type_MultiIds?: number | null;
	rowid_note?: number | null;
	rowid_value?: number | null;
	itemid_note?: string | null;
	itemid_value?: string | null;
	metafieldgroupid?: string | null;
	accesskeylanguage?: string | null;
	metafieldids?: number | null;
}

export interface IMetadataItemsResponse {
	result: any[];
}

export class MetadataItems extends BaseRequest<any, any> {

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
	get defaultPayload(): IMetadataItemsPayload {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			searchName: 'DigiZuite_system_metadatav2_listGroupsMetafields',
			limit: 9999,
			page: 1,
			itemid_note_type_MultiIds: null,
			itemid_value_type_MultiIds: null,
			rowid_note: null,
			rowid_value: null,
			itemid_note: null,
			itemid_value: null,
			metafieldgroupid: null,
			metafieldids: null,
			accesskeylanguage: null,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: IMetadataItemsPayload) {

		if(payload.assetId) {
			payload.itemid_note = payload.assetId;
			payload.itemid_note_type_MultiIds = 1;
			payload.rowid_note = 1;
			payload.itemid_value = payload.assetId;
			payload.itemid_value_type_MultiIds = 1;
			payload.rowid_value = 1;
			payload.assetId = undefined;
		}

		payload.accesskeylanguage = payload.language;
		payload.language = undefined;

		payload.metafieldgroupid = payload.id;
		payload.id = undefined;

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {

		return response.items
			.map(this._createMetadataItem)
			.filter((thisItem: any) => thisItem);

	}

	/**
	 * Transforms the API response in an instance of a metadata type
	 * @param thisItem
	 * @private
	 */
	private _createMetadataItem(thisItem: any): MetadataItem<any> | null {

		let result: MetadataItem<any>;

		// Yeahhh... no...
		switch (parseInt(thisItem.metafieldid.item_datatypeid, 10)) {
			case BitMetadataItem.TYPE:
				result = new BitMetadataItem(thisItem);
				break;
			case StringMetadataItem.TYPE:
				result = new StringMetadataItem(thisItem);
				break;
			case NoteMetadataItem.TYPE:
				result = new NoteMetadataItem(thisItem);
				break;
			case ComboValueMetadataItem.TYPE:
				result = new ComboValueMetadataItem(thisItem);
				break;
			case EditMultiComboValueMetadataItem.TYPE:
				result = new EditMultiComboValueMetadataItem(thisItem);
				break;
			case TreeMetadataItem.TYPE:
				result = new TreeMetadataItem(thisItem);
				break;
			case LinkMetadataItem.TYPE:
				result = new LinkMetadataItem(thisItem);
				break;
			case DateTimeMetadataItem.TYPE:
				result = new DateTimeMetadataItem(thisItem);
				break;
			case FloatMetadataItem.TYPE:
				result = new FloatMetadataItem(thisItem);
				break;
			case IntMetadataItem.TYPE:
				result = new IntMetadataItem(thisItem);
				break;
			case MoneyMetadataItem.TYPE:
				result = new MoneyMetadataItem(thisItem);
				break;
			case UniqueVersionMetadataItem.TYPE:
				result = new UniqueVersionMetadataItem(thisItem);
				break;
			case EditComboValueMetadataItem.TYPE:
				result = new EditComboValueMetadataItem(thisItem);
				break;
			case MultiComboValueMetadataItem.TYPE:
				result = new MultiComboValueMetadataItem(thisItem);
				break;
			case MasterItemReferenceMetadataItem.TYPE:
				LogWarn('MasterItemReference metadata type not supported!');
				return null;
			case SlaveItemReferenceMetadataItem.TYPE:
				LogWarn('SlaveItemReference metadata type not supported!');
				return null;
			default:
				// Lol
				LogWarn('Unknown metadata type', thisItem);
				return null;
		}

		result.setValueFromAPI(thisItem);

		return result;
	}

}
