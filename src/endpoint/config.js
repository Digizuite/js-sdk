import {attachEndpoint} from '../connector';
import {Endpoint} from '../common/endpoint';
import {AppConfiguration} from '../request/searchService/appConfiguration';
import {AppLabels} from '../request/configService/appLabels';
import {SystemVersion} from '../request/searchService/systemVersion';

export class Config extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {}  ) {
		super(args);
		
		this._cache = {};
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
	
	/**
	 * Get system version
	 * @returns {Promise}
	 */
	getSystemVersion() {
		
		const systemVersionRequest = new SystemVersion({
			apiUrl : this.apiUrl
		});
		
		return systemVersionRequest.execute();
	}
	
	/**
	 * Get app labels
	 * @returns {Promise}
	 */
	getAppLabels() {
		
		if( !this._cache.labelsPromise ) {
			
			const appConfigRequest = new AppLabels({
				apiUrl : this.apiUrl
			});
			
			this._cache.labelsPromise = appConfigRequest.execute();
		}
		
		return this._cache.labelsPromise;
	}
	
}

// Attach endpoint
const name = 'config';
const getter = function (instance){
	return new Config({
		apiUrl: instance.apiUrl
	});
};

attachEndpoint({ name, getter });