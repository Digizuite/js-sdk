import {BaseRequest} from 'common/request';
import {CloudFile} from 'model/cloudFile';

export class CreateUpload extends BaseRequest {
	
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
			method      : 'AddUploadFileWithNameAndSettingsNoDate',
			computername: this.computerName,
			filename    : null,
			name        : null,
			filesize    : 0,
			settingsxml : null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		// ComputerName
		payload.computername = payload.computerName;
		payload.computerName = undefined;
		
		// File info
		if( payload.file ) {
			
			
			if( !payload.filename ) {
				payload.filename =  payload.file instanceof CloudFile ?
					payload.file.location : payload.file.name;
			}
			
			if( !payload.name ) {
				payload.name = payload.file.name.substring(0, payload.file.name.lastIndexOf('.'));
			}
			
			payload.filesize = payload.file.size;
			
			payload.file = undefined;
		}
		
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return response.items[0];
	}
	
}