import {BaseRequest} from '../../common/request';
import {RestoreTicket} from '../../model/ticket/restoreTicket';

export class SetFileName extends BaseRequest {
	
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
			method  : 'SetFileName',
			UploadID: null,
			fileName: null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		// File name
		if( payload.ticket instanceof RestoreTicket) {
			payload.fileName = payload.ticket.version.getSourceLocation();
		} else {
			payload.fileName = payload.ticket.file.name;
		}
		
		// UploadID
		payload.UploadID = payload.ticket.uploadId;
		
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