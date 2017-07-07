export class Endpoint {
	
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
	
}