import {Request} from 'common/request';

export class DownloadQualities extends Request {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}MemberService.js`;
	}
	
	
	/**
	 * default params
	 * @returns {{method: string}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method: 'GetDownloadQualities',
		};
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		// We are only interested in the items
		return response.downloadQualities;
	}
	
}