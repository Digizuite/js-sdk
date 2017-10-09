import {BaseRequest} from '../../common/request';
import {CloudFile} from '../../model/cloudFile';
import {ReplaceTicket} from '../../model/ticket/replaceTicket';
import {RestoreTicket} from '../../model/ticket/restoreTicket';
import {SetTransferMode} from './setTransferMode';

export class FinishUpload extends BaseRequest<any> {

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
			assetId: null,
			fileName: null,
			progChainId: null,
			extraJobParams: null,
			transferMode: null,
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

		// method
		if (payload.ticket instanceof RestoreTicket) {
			payload.method = 'FinishRestore';
		} else if (payload.ticket instanceof ReplaceTicket) {
			payload.method = 'FinishReplace';
		} else {
			payload.method = 'FinishUpload';
		}

		// File name
		if (payload.ticket instanceof RestoreTicket) {
			payload.fileName = payload.ticket.version.getSourceLocation();
		} else if (!(payload.ticket.file instanceof CloudFile)) {
			payload.fileName = payload.ticket.file.name;
		}

		// Transfer Mode
		if (payload.ticket instanceof RestoreTicket) {
			payload.transferMode = SetTransferMode.TRANSFER_MODE.DIRECT_COPY;
		} else if (payload.ticket.file instanceof CloudFile) {
			payload.transferMode = SetTransferMode.TRANSFER_MODE.HTTP_DOWNLOAD;
		} else {
			payload.transferMode = SetTransferMode.TRANSFER_MODE.UNC;
		}

		// Asset ID
		if (
			(payload.ticket instanceof RestoreTicket) ||
			(payload.ticket instanceof ReplaceTicket)
		) {
			payload.assetId = payload.ticket.asset.__assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE;
		}

		// Extra job
		if (payload.ticket.isExtendedJob()) {
			const extraParams = payload.ticket.getExtendedJobParameters();
			Object.keys(extraParams)
				.forEach(thisKey => payload[thisKey] = extraParams[thisKey]);
		}

		// Unset the ticket
		payload.ticket = undefined;

		return payload;
	}

	/**
	 * Process response
	 */
	protected processResponseData(): any {
		return {};
	}

}
