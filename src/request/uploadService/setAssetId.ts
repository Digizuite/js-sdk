import {BaseRequest} from '../../common/request';
import {ReplaceTicket} from '../../model/ticket/replaceTicket';

export class SetAssetId extends BaseRequest<any> {

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
			method: 'SetAssetID',
			UploadID: null,
			assetId: null,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any): any {

		// UploadID
		payload.UploadID = payload.ticket.uploadId;

		if (payload.ticket instanceof ReplaceTicket) {
			payload.assetId = payload.ticket.asset.__assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE;
		} else {
			payload.assetId = payload.ticket.version.id;
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
