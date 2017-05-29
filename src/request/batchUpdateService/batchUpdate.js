import {BaseRequest} from 'common/request';
import {UpdateBatch} from 'common/updateBatch';
import {DateTimeMetadataItem} from 'model/metadata/dateTimeMetadataItem';
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
			accessKey                 : 0,
			updateXML                 : 0,
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
		
		console.debug("---------------------");
		
		const metadataItems = [ ...payload.metadataItems, this.getLastModifiedMetadataItem() ];
		
		// Compose all the metadata items into a batch
		metadataItems.forEach((thisMetadataItem)=>{
		
			const batch = new UpdateBatch({
				type: UpdateBatch.BATCH_TYPE.ItemIdsValuesRowid,
				itemIds: [ payload.asset.id ],
				rowId: UpdateBatch.ROW_ID.NonIncremental
			});
			
			batch.appendValue({
				// Update specified metafield (given by House og Co.)
				fieldName: 'metafield',
				fieldProperties: {
					standardGuid: 'D10AEF8D-AF0E-4E33-BCB8-4D71E2C55269'
				},
				// Update integer-list to contain currently selected favorites
				valueType: UpdateBatch.VALUE_TYPE.IntList,
				value: [1,2,3,4]
			});
			
			updateXml += batch.getBatchXML();
			updateValues.push( batch.getBatchJSON() );
		});
		
		// Final strap to payload
		payload.updateXML = `<r>${updateXml}</r>`;
		payload.values = JSON.stringify(updateValues);
		payload.asset = undefined;
		payload.metadataItems = undefined;
		
		debugger;
		
		return {};
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		debugger;
		return response;
	}
	
}