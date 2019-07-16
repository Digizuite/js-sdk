import {BaseRequest} from '../../common/request';

export class InitiateUpload extends BaseRequest<any> {

	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}UploadService.js`;
	}

	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method: 'InitiateUpload',
			uploadername: null,
			filename: null,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any): any {

		// ComputerName
		payload.uploadername = payload.computerName;
		payload.computerName = undefined;

		// File info
		if (payload.file) {
			payload.filename = payload.file.name;
			payload.file = undefined;
		}

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {
		return {
			itemId: response.items[0].itemId,
			uploadId: response.items[0].uploadId,
		};
	}

}
