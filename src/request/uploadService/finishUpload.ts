import {BaseRequest} from '../../common/request';
import {SetTransferMode} from './setTransferMode';
import {ReplaceTicket} from '../../model/ticket/replaceTicket';
import {RestoreTicket} from '../../model/ticket/restoreTicket';
import {CloudFile} from '../../model/cloudFile';

export class FinishUpload extends BaseRequest {
	
	/**
	 * C-tor
	 * @param {Object} args
	 */
	constructor( args = {}  ) {
		super(args);
		
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
			method        : null,
			UploadID      : null,
			assetId       : null,
			fileName      : null,
			progChainId   : null,
			extraJobParams: null,
			transferMode  : null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		// UploadID
		payload.UploadID = payload.ticket.uploadId;
		
		// method
		if( payload.ticket instanceof RestoreTicket ) {
			payload.method = 'FinishRestore';
		} else if( payload.ticket instanceof ReplaceTicket ) {
			payload.method = 'FinishReplace';
		} else {
			payload.method = 'FinishUpload';
		}
		
		// File name
		if( payload.ticket instanceof RestoreTicket) {
			payload.fileName = payload.ticket.version.getSourceLocation();
		} else if( !(payload.ticket.file instanceof CloudFile) ) {
			payload.fileName = payload.ticket.file.name;
		}
		
		// Transfer Mode
		if( payload.ticket instanceof RestoreTicket ) {
			payload.transferMode = SetTransferMode.TRANSFER_MODE.DIRECT_COPY;
		} else if( payload.ticket.file instanceof CloudFile ) {
			payload.transferMode = SetTransferMode.TRANSFER_MODE.HTTP_DOWNLOAD;
		} else {
			payload.transferMode = SetTransferMode.TRANSFER_MODE.UNC;
		}
		
		// Asset ID
		if(
			(payload.ticket instanceof RestoreTicket) ||
			(payload.ticket instanceof ReplaceTicket)
		) {
			payload.assetId = payload.ticket.asset.__assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE;
		}
		
		// Extra job
		if( payload.ticket.isExtendedJob() ) {
			const extraParams = payload.ticket.getExtendedJobParameters();
			Object.keys(extraParams)
				.forEach( thisKey => payload[thisKey] = extraParams[thisKey] );
		}
		
		// Unset the ticket
		payload.ticket = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 */
	processResponseData() {
		return {};
	}
	
}