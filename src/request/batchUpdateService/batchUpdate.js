import {BaseRequest} from 'common/request';
import {UpdateBatch} from 'utilities/digizuite/updateBatch';
import {DateTimeMetadataItem} from 'model/metadata/dateTimeMetadataItem';
import {MetadataItem} from 'model/metadata/metadataItem';
import {Constants} from 'const';

export class BatchUpdate extends BaseRequest {
	
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
		return `${this.apiUrl}BatchUpdateService.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			useMetadataVersionedAccess: 0,
			updateXML                 : '',
			values                    : null,
		};
	}
	
	/**
	 *
	 * @returns {DateTimeMetadataItem}
	 */
	getLastModifiedMetadataItem() {
		return new DateTimeMetadataItem({
			guid : Constants.GUID.LAST_MODIFIED,
			value : new Date()
		});
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		let updateXml = '';
		let updateValues = [];
		
		const metadataItems = [ ...payload.metadataItems, this.getLastModifiedMetadataItem() ];
		
		// Create an update batch
		const batch = new UpdateBatch({
			type: UpdateBatch.BATCH_TYPE.ItemIdsValuesRowid,
			itemIds: [ payload.asset.id ],
			rowId: UpdateBatch.ROW_ID.NonIncremental
		});
		
		// Compose all the metadata items into a batch
		metadataItems.forEach(
			thisMetadataItem => batch.appendValue( this.getBatchValueFromMetadataItem(thisMetadataItem) )
		);
		
		// Get the XML and JSON
		updateXml += batch.getBatchXML();
		updateValues.push( batch.getBatchJSON() );
		
		// Final strap to payload
		payload.updateXML = `<r>${updateXml}</r>`;
		payload.values = JSON.stringify(updateValues);
		payload.asset = undefined;
		payload.metadataItems = undefined;
		
		return payload;
	}
	
	/**
	 * Computes a batch value from the metadata item
	 * @param metadataItem
	 * @returns {{fieldName: string, fieldProperties: {}, valueType: (*|{String: number, Bool: number, Int: number, DateTime: number, Float: number, IntList: number, Folder: number, AssetType: number, StringRow: number, BoolRow: number, IntRow: number, DateTimeRow: number, FloatRow: number, IntListRow: number, Delete: number, ValueExtraValue: number, StringList: number, StringListRow: number}), value: (string|null)}}
	 */
	getBatchValueFromMetadataItem( metadataItem ) {
		
		const batchValue = {
			// Update the metafield with the given labelId
			fieldName      : metadataItem instanceof MetadataItem ? 'metafield' : '',
			fieldProperties: {},
			
			// Store the value
			valueType: metadataItem.VALUE_TYPE,
			value    : metadataItem.getBatchValue()
		};
		
		// Determine if we should use labelId or GUID
		if( metadataItem.labelId ) {
			batchValue.fieldProperties.labelId = metadataItem.labelId;
		} else if( metadataItem.guid ) {
			batchValue.fieldProperties.standardGuid = metadataItem.guid;
		}
		
		return batchValue;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return response.items;
	}
	
}