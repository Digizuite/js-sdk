import {BaseRequest} from '../../common/request';

export class SetArchiveReplace extends BaseRequest<any> {

	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}UploadRest.js`;
	}

	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method: 'SetArchiveReplaceMode',
			archivereplaced: 1,
			UploadID: null,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any): any {

		// UploadID
		payload.UploadID = payload.uploadId;
		payload.uploadId = undefined;

		return payload;
	}

	/**
	 * Process response
	 */
	protected processResponseData() {
		return {};
	}

}
