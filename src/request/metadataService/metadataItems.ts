import {BaseRequest} from '../../common/request';
import {StringMetadataItem} from '../../model/metadata/stringMetadataItem';
import {NoteMetadataItem} from '../../model/metadata/noteMetadataItem';
import {EditMultiComboValueMetadataItem} from '../../model/metadata/editMultiComboValueMetadataItem';
import {TreeMetadataItem} from '../../model/metadata/treeMetadataItem';
import {LinkMetadataItem} from '../../model/metadata/linkMetadataItem';
import {BitMetadataItem} from '../../model/metadata/bitMetadataItem';
import {ComboValueMetadataItem} from '../../model/metadata/comboValueMetadataItem';
import {DateTimeMetadataItem} from '../../model/metadata/dateTimeMetadataItem';
import {FloatMetadataItem} from '../../model/metadata/floatMetadataItem';
import {IntMetadataItem} from '../../model/metadata/intMetadataItem';
import {MoneyMetadataItem} from '../../model/metadata/moneyMetadataItem';
import {MultiComboValueMetadataItem} from '../../model/metadata/multiComboValueMetadataItem';
import {UniqueVersionMetadataItem} from '../../model/metadata/uniqueVersionMetadataItem';
import {EditComboValueMetadataItem} from '../../model/metadata/editComboValueMetadataItem';
import {LogWarn} from '../../utilities/logger';
import {MetadataItem} from "../../model/metadata/metadataItem";

export interface IMetadataItemsPayload {
    id?: string | any;
    language?: string | any;
    assetId?: string | any;
    searchName?: string,
    limit?: number,
    page?: number,
    itemid_note_type_MultiIds?: number,
    itemid_value_type_MultiIds?: number,
    rowid_note?: number,
    rowid_value?: number,
    itemid_note?: string | null,
    itemid_value?: string | null,
    metafieldgroupid?: string | null,
    accesskeylanguage?: string | null,
}

export interface IMetadataItemsResponse {
    result: any[];
}

export class MetadataItems extends BaseRequest<any> {

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
            itemid_note_type_MultiIds: 1,
            itemid_value_type_MultiIds: 1,
            rowid_note: 1,
            rowid_value: 1,
            itemid_note: null,
            itemid_value: null,
            metafieldgroupid: null,
            accesskeylanguage: null,
        };
    }

    /**
     * Pass-through
     * @param {Object} payload
     * @returns {Object}
     */
    processRequestData(payload: IMetadataItemsPayload) {

        payload.itemid_note = payload.assetId;
        payload.itemid_value = payload.assetId;
        payload.assetId = undefined;

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
    processResponseData(response: any) {

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
            default:
                // Lol
                LogWarn('Unknown metadata type', thisItem);
                return null;
        }

        result.setValueFromAPI(thisItem);

        return result;
    }

}