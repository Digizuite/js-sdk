import {BaseRequest} from '../../common/request';

export class CopyMetadata extends BaseRequest<any> {
	
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
			method           : 'CopyMetadata',
			copyDeps         : 1,
			copyUniqueVersion: 1,
			sourceItemId     : null,
			targetItemId     : null
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
    processRequestData(payload: any): any {
		
		if( payload.hasOwnProperty('ticket') ) {

			payload.sourceItemId = payload.ticket.asset.id;
			payload.targetItemId = payload.ticket.itemId;

			payload.ticket = undefined;

		} else if( payload.hasOwnProperty('sourceAsset')  && payload.hasOwnProperty('targetAsset')  ) {

			payload.sourceItemId = payload.sourceAsset.id;
			payload.targetItemId = payload.targetAsset.id;

			payload.sourceAsset = undefined;
			payload.targetAsset = undefined;

		}
		
		return payload;
	}
	
	/**
	 * Process response
	 */
	processResponseData() {
		return {};
	}
	
}