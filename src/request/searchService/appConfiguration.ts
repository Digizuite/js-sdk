import {PermissionError} from '../../common/permissionError';
import {BaseRequest} from '../../common/request';
import {RequestError} from '../../common/requestError';
import {ERROR_CODE} from '../../const';

export class AppConfiguration extends BaseRequest<any> {

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
			SearchName: 'DigiZuite_System_Configs',
			page: 1,
			limit: 25,
		};
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {

		if (!Array.isArray(response.items)) {
			throw new RequestError('Malformed response in DigiZuite_System_Configs.');
		}

		if (response.items.length === 0) {
			throw new PermissionError('User does not have access to this product.', ERROR_CODE.USER_NOT_ALLOWED_PRODUCT_ACCESS);
		}

		const config = response.items[0];

		// Enforce data types
		config.DefaultLanguage = parseInt(config.DefaultLanguage, 10);
		config.languages = config.languages.map((thisLanguage: any) => {
			thisLanguage.languageId = parseInt(thisLanguage.languageId, 10);
			return thisLanguage;
		});

		if( !Array.isArray(config.HighResMediaFormatIds) ) {
            config.HighResMediaFormatIds = [];
		}

		config.HighResMediaFormatIds = config.HighResMediaFormatIds.map((thisId: any) => parseInt(thisId, 10));

        if( !Array.isArray(config.LowResMediaFormatIds) ) {
            config.LowResMediaFormatIds = [];
        }

        config.LowResMediaFormatIds = config.LowResMediaFormatIds.map((thisId: any) => parseInt(thisId, 10));


        // We are only interested in the user data
		return config;
	}

}
