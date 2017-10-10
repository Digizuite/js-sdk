import {BaseRequest} from '../../common/request';

export class SubmitUpload extends BaseRequest<any> {

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
			method: null,
			UploadID: null,
			progChainId: null,
			extraJobParams: null,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any): any {

		// Submit method
		payload.method = payload.ticket.isExtendedJob() ? 'SubmitUploadExtendet' : 'SubmitUpload';

		// uploadID
		payload.UploadID = payload.ticket.uploadId;

		// Extra job
		if (payload.ticket.isExtendedJob()) {
			const extraParams = payload.ticket.getExtendedJobParameters();
			Object.keys(extraParams)
				.forEach(thisKey => payload[thisKey] = extraParams[thisKey]);
		}

		payload.ticket = undefined;

		return payload;
	}

	/**
	 * Process response
	 */
	protected processResponseData() {
		return {};
	}

}