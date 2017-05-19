import {Endpoint} from 'common/endpoint';
import {AppConfiguration} from 'request/searchService/appConfiguration';

export class Config extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {}  ) {
		super(args);
	}
	
	/**
	 * Get app configurations
	 * @returns {Promise}
	 */
	getAppConfiguration() {
		
		const appConfigRequest = new AppConfiguration({
			apiUrl : this.apiUrl
		});
		
		return appConfigRequest.execute();
	}
	
}