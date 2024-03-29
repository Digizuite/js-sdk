import {BaseRequest} from '../../common/request';
import {CreateFolderFromApiResponse, Folder} from '../../model/folder';
import {getItemIdFromIdPath} from '../../utilities/helpers/treePath';

export class Folders extends BaseRequest<any, Folder[]> {

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
			SearchName: 'Digizuite_system_metadatav2_tree',
			page: 1,
			limit: 9999,
			sfMetafieldLabelId: null,
			node: null,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {

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
	protected processResponseData(response: any) {
		// We are only interested in the items
		return response.items.map(CreateFolderFromApiResponse);
	}

}
