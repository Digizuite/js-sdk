import {BaseRequest} from 'common/request';
import {RestoreTicket} from 'model/ticket/restoreTicket';
import {CloudFile} from 'model/cloudFile';

export class SetTransferMode extends BaseRequest {
	
	/**
	 * Transfer mode
	 * @returns {{NONE: number, UNC: number, FTP: number, HTTP: number, DIRECT: number, HTTP_DOWNLOAD: number, DIRECT_COPY: number}}
	 * @constructor
	 */
	static get TRANSFER_MODE() {
		return {
			NONE         : 0,
			UNC          : 1,
			FTP          : 2,
			HTTP         : 3,
			DIRECT       : 4,
			HTTP_DOWNLOAD: 5,
			DIRECT_COPY  : 6,
		};
	}
	
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
			method      : 'SetTransferMode',
			transferMode: null,
			UploadID    : null
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		if( payload.ticket instanceof RestoreTicket) {
			payload.transferMode = SetTransferMode.TRANSFER_MODE.DIRECT_COPY;
		} else if( payload.ticket.file instanceof CloudFile ) {
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
	processResponseData() {
		return {};
	}
	
}