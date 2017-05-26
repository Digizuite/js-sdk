import {BaseRequest} from 'common/request';
import {StringMetadataItem} from 'model/metadata/stringMetadataItem';
import {NoteMetadataItem} from 'model/metadata/noteMetadataItem';
import {EditMultiComboValueMetadataItem} from 'model/metadata/editMultiComboValueMetadataItem';
import {TreeMetadataItem} from 'model/metadata/treeMetadataItem';
import {LinkMetadataItem} from 'model/metadata/linkMetadataItem';
import {BitMetadataItem} from 'model/metadata/bitMetadataItem';
import {ComboValueMetadataItem} from 'model/metadata/comboValueMetadataItem';
import {DateTimeMetadataItem} from 'model/metadata/dateTimeMetadataItem';
import {FloatMetadataItem} from 'model/metadata/floatMetadataItem';
import {IntMetadataItem} from 'model/metadata/intMetadataItem';
import {MoneyMetadataItem} from 'model/metadata/moneyMetadataItem';
import {MultiComboValueMetadataItem} from 'model/metadata/multiComboValueMetadataItem';
import {UniqueVersionMetadataItem} from 'model/metadata/uniqueVersionMetadataItem';
import {EditComboValueMetadataItem} from 'model/metadata/editComboValueMetadataItem';
import {ComboValue} from 'model/metadata/comboValue';
import {TreeValue} from 'model/metadata/treeValue';

export class MetadataItems extends BaseRequest {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args = {}) {
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
			searchName                : 'DigiZuite_system_metadatav2_listGroupsMetafields',
			limit                     : 9999,
			page                      : 1,
			itemid_note_type_MultiIds : 1,
			itemid_value_type_MultiIds: 1,
			rowid_note                : 1,
			rowid_value               : 1,
			itemid_note               : null,
			itemid_value              : null,
			metafieldgroupid          : null,
			accesskeylanguage         : null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		payload.itemid_note  = payload.assetId;
		payload.itemid_value = payload.assetId;
		payload.assetId      = undefined;
		
		payload.accesskeylanguage = payload.language;
		payload.language          = undefined;
		
		payload.metafieldgroupid = payload.id;
		payload.id               = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		
		return response.items.map((thisItem) => {
			
			let result;
			
			let value;
			
			// Yeahhh... no...
			switch (parseInt(thisItem.metafieldid.item_datatypeid, 10)) {
				case BitMetadataItem.TYPE:
					result = BitMetadataItem.createFromAPIResponse(thisItem);
					break;
				case StringMetadataItem.TYPE:
					result = StringMetadataItem.createFromAPIResponse(thisItem);
					break;
				case NoteMetadataItem.TYPE:
					result = NoteMetadataItem.createFromAPIResponse(thisItem);
					break;
				case ComboValueMetadataItem.TYPE:
					if (Array.isArray(thisItem.item_metafield_valueid)) {
						value = new ComboValue({
							id   : parseInt(thisItem.item_metafield_valueid[0].item_combo_valueid, 10),
							value: thisItem.item_metafield_valueid[0].combooptionvalue
						});
					} else {
						value = null;
					}
					return new ComboValueMetadataItem({
						guid    : thisItem.metafieldid.metafieldItemGuid,
						name    : thisItem.metafieldid.metafieldName,
						value   : value,
						required: parseInt(thisItem.metafieldid.metafieldIsRequired, 10),
					});
					break;
				case EditMultiComboValueMetadataItem.TYPE:
					result = EditMultiComboValueMetadataItem.createFromAPIResponse(thisItem);
					break;
				case TreeMetadataItem.TYPE:
					result = TreeMetadataItem.createFromAPIResponse(thisItem);
					break;
				case LinkMetadataItem.TYPE:
					result = LinkMetadataItem.createFromAPIResponse(thisItem);
					break;
				case DateTimeMetadataItem.TYPE:
					result = DateTimeMetadataItem.createFromAPIResponse(thisItem);
					break;
				case FloatMetadataItem.TYPE:
					result = FloatMetadataItem.createFromAPIResponse(thisItem);
					break;
				case IntMetadataItem.TYPE:
					result = IntMetadataItem.createFromAPIResponse(thisItem);
					break;
				case MoneyMetadataItem.TYPE:
					result = MoneyMetadataItem.createFromAPIResponse(thisItem);
					break;
				case UniqueVersionMetadataItem.TYPE:
					result = UniqueVersionMetadataItem.createFromAPIResponse(thisItem);
					break;
				case EditComboValueMetadataItem.TYPE:
					return new EditComboValueMetadataItem({
						guid    : thisItem.metafieldid.metafieldItemGuid,
						name    : thisItem.metafieldid.metafieldName,
						value   : Array.isArray(thisItem.item_metafield_valueid) ? thisItem.item_metafield_valueid[0].metaValue : '',
						required: parseInt(thisItem.metafieldid.metafieldIsRequired, 10),
					});
					break;
				case MultiComboValueMetadataItem.TYPE:
					return new MultiComboValueMetadataItem({
						guid    : thisItem.metafieldid.metafieldItemGuid,
						name    : thisItem.metafieldid.metafieldName,
						value   : Array.isArray(thisItem.item_metafield_valueid) ? thisItem.item_metafield_valueid[0].metaValue : '',
						required: parseInt(thisItem.metafieldid.metafieldIsRequired, 10),
					});
					break;
				default:
					// Lol
					break;
			}
			
			return result;
		});
		
	}
	
}