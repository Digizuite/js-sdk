import {Request} from 'common/request';
import trimEnd from 'lodash/trimEnd';

export class Folders extends Request {
	
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
		let node = trimEnd( payload.path, '/' ).split('/').pop();
		payload.node = parseInt(node, 10) || 0;
		
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
		return response.items.map(this._processFolderResult);
	}
	
	/**
	 * Nice-ify the result from the folder response
	 * @param thisFolder
	 * @returns {{path: string, name: (string), hasChildren: boolean, writable: boolean}}
	 * @private
	 */
	_processFolderResult(thisFolder) {
		return {
			path       : thisFolder.idPath,
			name       : thisFolder.text,
			hasChildren: parseInt(thisFolder.Children, 10) > 0,
			writable   : parseInt(thisFolder.writeaccess, 10) === 1
		};
	}
	
}