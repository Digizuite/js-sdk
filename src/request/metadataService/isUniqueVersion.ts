import {BaseRequest} from '../../common/request';

export class IsUniqueVersion extends BaseRequest<any> {

	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}MetadataService.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method : 'IsUniqueVersionUnique',
			rowid  : 1,
			itemId : null,
			version: null,
			unique : null,
			mlid   : null,
		};
	}
	
	/**
	 * Pre-process
	 * @param {Object} payload
	 * @returns {Object}
	 */
    processRequestData(payload: any) {
		
		payload.itemId = payload.asset.id;
		payload.asset = undefined;
		
		payload.mlid = payload.metadataItem.labelId;
		payload.version = payload.metadataItem.value.version;
		payload.unique = payload.metadataItem.value.unique;
		
		payload.metadataItem = undefined;
		
		return payload;
	}
	
	/**
	 * Return empty
	 * @returns {undefined}
	 */
	processResponseData() {
		return undefined;
	}
	
}