import {BaseRequest} from '../../common/request';
import {RequestError} from '../../common/requestError';
import isObject from "lodash-es/isObject";

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
    processResponseData(response: any) {
		
		if(!Array.isArray(response.items) || !isObject(response.items[0])) {
			throw new RequestError('Malformed response in DigiZuite_System_Configs.');
		}
		
		const config = response.items[0];
		
		// Enforce data types
		config.DefaultLanguage = parseInt(config.DefaultLanguage, 10);
        config.languages = config.languages.map((thisLanguage: any) => {
			thisLanguage.languageId = parseInt(thisLanguage.languageId, 10);
			return thisLanguage;
		});

        config.HighResMediaFormatIds = config.HighResMediaFormatIds.map((thisId: any) => parseInt(thisId, 10));
        config.LowResMediaFormatIds = config.LowResMediaFormatIds.map((thisId: any) => parseInt(thisId, 10));

		// We are only interested in the user data
		return config;
	}
	
	
}