import {BaseRequest} from 'common/request';
import {ReplaceTicket} from 'model/ticket/replaceTicket';
import {RestoreTicket} from 'model/ticket/restoreTicket';

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
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method  : null,
			UploadID: null
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
		} else {
			payload.fileName = payload.ticket.file.name;
		}
		
		// Asset ID
		payload.assetId = payload.ticket.asset.__assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE;
		
		// if( payload.ticket instanceof RestoreTicket ) {
		// 	payload.assetId = payload.ticket.version.id;
		// } else if( payload.ticket instanceof ReplaceTicket ) {
		// 	payload.assetId = payload.ticket.asset.__assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE;
		// }
		
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