import {BaseRequest} from '../../common/request';
import {Folder} from '../../model/folder';
import {getItemIdFromIdPath} from '../../utilities/helpers/treePath';

export class Folders extends BaseRequest {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 * default params
	 * @returns {{SearchName: string, page: number, limit: number}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			SearchName        : 'Digizuite_system_metadatav2_tree',
			page              : 1,
			limit             : 9999,
			sfMetafieldLabelId: null,
			node              : null
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		// path -> node
		payload.node = getItemIdFromIdPath(payload.path);
		
		// remove unused proprieties
		payload.path = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		// We are only interested in the items
		return response.items.map( thisFolder => Folder.createFromAPIResponse(thisFolder) );
	}
	
}