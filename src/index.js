import endsWith from 'lodash/endsWith';
import {Auth} from 'endpoint/auth';

export class Connector {
	
	/**
	 * Getter for the auth endpoint
	 * @returns {Auth}
	 */
	get auth() {

		if( !this._authEndpoint ) {
			this._authEndpoint = new Auth( {
				apiUrl : this.apiUrl
			} );
		}
		
		return this._authEndpoint;
	}
	
	//noinspection JSUnusedGlobalSymbols
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {} ) {
	
		if( typeof args.apiUrl !== 'string' || args.apiUrl.length === 0 ) {
			throw new Error( 'apiUrl is a required parameter' );
		}
		
		this.apiUrl = Connector.ensureTrailingSeparator(args.apiUrl);
	
	}
	
	/**
	 * Ensure correct trailing /
	 * @param url
	 * @returns {string}
	 */
	static ensureTrailingSeparator (url = '') {
		return url + (endsWith(url, '/') ? '' : '/');
	}
	
}