import {BaseRequest} from '../../common/request';
import {CloudFile} from '../../model/cloudFile';
import {RestoreTicket} from '../../model/ticket/restoreTicket';

export class SetTransferMode extends BaseRequest<any> {

	/**
	 * Transfer mode
	 */
	static get TRANSFER_MODE() {
		return {
			NONE: 0,
			UNC: 1,
			FTP: 2,
			HTTP: 3,
			DIRECT: 4,
			HTTP_DOWNLOAD: 5,
			DIRECT_COPY: 6,
		};
	}

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
			method: 'SetTransferMode',
			transferMode: null,
			UploadID: null,
		};
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any): any {

		if (payload.ticket instanceof RestoreTicket) {
			payload.transferMode = SetTransferMode.TRANSFER_MODE.DIRECT_COPY;
		} else if (payload.ticket.file instanceof CloudFile) {
			payload.transferMode = SetTransferMode.TRANSFER_MODE.HTTP_DOWNLOAD;
		} else {
			payload.transferMode = SetTransferMode.TRANSFER_MODE.UNC;
		}

		// UploadID
		payload.UploadID = payload.ticket.uploadId;

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
