import {attachEndpoint} from '../connector';
import {Endpoint} from '../common/endpoint';
import {UpdateContainer} from '../utilities/updateContainer';
import {BatchUpdate} from '../request/batchUpdateService/batchUpdate';

export class Batch extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {}  ) {
		super(args);
	}
	
	/**
	 * Make a batch update
	 * @param {Object} args
	 * @param {UpdateContainer} args.batch
	 * @return {Promise}
	 */
	update( args ) {
		
		if( !(args.batch instanceof UpdateContainer) ) {
			throw new Error('update expects a batch parameter');
		}
		
		const batchUpdateRequest = new BatchUpdate({
			apiUrl : this.apiUrl,
		});
		
		return batchUpdateRequest.execute({
			batch : args.batch
		});
		
	}
	
}

// Attach endpoint
const name = 'batch';
const getter = function (instance) {
	return new Batch({
		apiUrl: instance.apiUrl
	});
};

attachEndpoint({ name, getter });
