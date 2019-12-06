import {BaseRequest} from '../../common/request';
import {TreeOption} from '../../model/metadata/treeOption';
import {getItemIdFromIdPath} from '../../utilities/helpers/treePath';

export class TreeOptions extends BaseRequest<any, any> {

	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}

	/**
	 * Default payload
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			searchName: 'Digizuite_system_metadatav2_tree',
			page: 1,
			limit: 25,
			sfMetafieldLabelId: null,
			node: 0,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {

		payload.sfMetafieldLabelId = payload.metadataItem.labelId;
		payload.metadataItem = undefined;

		// Navigation data
		if (payload.hasOwnProperty('navigation')) {

			if (payload.navigation.hasOwnProperty('page')) {
				payload.page = payload.navigation.page;
			}
			if (payload.navigation.hasOwnProperty('limit')) {
				payload.limit = payload.navigation.limit;
			}

			payload.navigation = undefined;
		}

		if (payload.hasOwnProperty('path')) {
			payload.node = payload.path ? getItemIdFromIdPath(payload.path) : 0;
			payload.path = undefined;
		}

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {
		return {
			navigation: {total: parseInt(response.total, 10)},
			options: response.items.map((thisOption: any) => TreeOption.createFromAPIResponse(thisOption)),
		};
	}

}
