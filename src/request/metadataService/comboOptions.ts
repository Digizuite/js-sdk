import {BaseRequest} from '../../common/request';
import {ComboOption} from '../../model/metadata/comboOption';

export class ComboOptions extends BaseRequest<any> {

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
			searchName: 'DigiZuite_System_metadatav2_combobox',
			page: 1,
			limit: 25,
			sfMetafieldLabelId: null,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {

		if( payload.metadataItem ) {
            payload.sfMetafieldLabelId = payload.metadataItem.labelId;
            payload.metadataItem = undefined;
        }

        if( payload.filter ) {
            payload.sfItemId = payload.filter.id;
            payload.filter = undefined;
        }

		// Navigation data
		if (payload.navigation) {

			if (payload.navigation.hasOwnProperty('page')) {
				payload.page = payload.navigation.page;
			}
			if (payload.navigation.hasOwnProperty('limit')) {
				payload.limit = payload.navigation.limit;
			}

			payload.navigation = undefined;
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
			options: response.items.map((thisOption: any) => ComboOption.createFromAPIResponse(thisOption)),
		};
	}

}
