import {RequestError} from 'common/requestError';

export class Request {
	
	/**
	 * To be overwritten
	 * @returns {string}
	 */
	get endpointUrl() {
		return this.apiUrl;
	}
	
	/**
	 * To be overwritten
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {};
	}
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {} ) {
		
		if( typeof args.apiUrl !== 'string' || args.apiUrl.length === 0 ) {
			throw new Error( 'apiUrl is a required parameter' );
		}
		
		this.apiUrl = args.apiUrl;
		
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData( payload = {} ) {
		return payload;
	}
	
	/**
	 * Pass-through
	 * @param {Object} response
	 * @returns {Object}
	 */
	processResponseData( response = {} ) {
		return response;
	}
	
	/**
	 * Execute!
	 * @param payload
	 * @returns {Promise}
	 */
	execute( payload = {} ) {
	
		// Merge the payload with the default one and pass it though the pre-process
		const requestData = this.processRequestData(
			Object.assign({}, this.defaultPayload, payload)
		);
		
		return new Promise( (resolve, reject)=> {
			
			const xhr = new XMLHttpRequest();
			
			xhr.open('POST', this.endpointUrl);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.setRequestHeader('X-Clacks-Overhead', 'GNU Terry Pratchett'); //A man is not dead while his name is still spoken.
			xhr.withCredentials = true;
			
			xhr.send( this.toQueryString(requestData) );
			
			xhr.onload = () => {
				
				if( xhr.status !== 200 ) {
					reject( new RequestError( xhr.statusText, xhr.status ) );
					return;
				}
				
				const response = JSON.parse(xhr.responseText);
				
				if( Request.containsError(response) ) {
					reject( new RequestError(
						Request.getErrorMessage(response),
						Request.getErrorCode(response)
					) );
				}
				
				try {
					resolve(JSON.parse(xhr.responseText));
				} catch(e) {
					reject(e);
				}
			};
			
			xhr.onerror = () => {
				reject( new RequestError('Unknown error', 0) );
			};
			
		}).then((response)=>{
			return this.processResponseData(response);
		});
		
	}
	
	/**
	 * Determines if a request fails based on the received response
	 * @param response
	 * @returns {boolean}
	 */
	static containsError( response ) {
		return (response.success === 'false' || response.success === false);
	}
	
	/**
	 * Returns the error message from the response
	 * @param response
	 * @returns {boolean}
	 */
	static getErrorMessage( response ) {
		return response.error;
	}
	
	/**
	 * Returns the error message from the response
	 * @param response
	 * @returns {Number}
	 */
	static getErrorCode( response ) {
		if( response.hasOwnProperty('warnings') ) {
			return parseInt(response.warnings[0].Code, 10);
		}
		
		return 0;
	}
	
	/**
	 * Yeah....
	 * @param paramsObject
	 * @returns {string}
	 */
	toQueryString( paramsObject = {} ) {
		return Object
			.keys(paramsObject)
			.filter( key => paramsObject[key] !== undefined && paramsObject[key] !== null )
			.map(key => {
				return Array.isArray( paramsObject[key] ) ?
					this.toTraditionalArray(key, paramsObject[key]) :
					`${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`;
			})
			.join('&');
	}
	
	/**
	 *
	 * @param key
	 * @param array
	 * @returns {string}
	 */
	toTraditionalArray( key, array ) {
		return array.map((thisVal)=>{
			return `${encodeURIComponent(key)}=${encodeURIComponent(thisVal)}`;
		}).join('&');
	}
	
}