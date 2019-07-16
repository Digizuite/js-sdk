import {BaseRequest} from '../../common/request';

export class ReplaceAsset extends BaseRequest<any> {

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
			method: 'ReplaceAsset',
			itemId: null,
			digiuploadId: null,
			targetAssetId: null,
			sourceAssetId: null,
			keepMetadata: true,
			overwrite: false,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any): any {

		if (payload.uploadId) {
			payload.digiuploadId = payload.uploadId;
			payload.uploadId = undefined;
		}

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {
		return response;
	}

}
