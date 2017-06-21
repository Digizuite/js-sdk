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
	 * @param {UpdateContainer[]} args.containers
	 * @return {Promise}
	 */
	update( args ) {
		
		// Ensure that we have containers in the format we want
		if(
			!args.hasOwnProperty('containers') ||
			!Array.isArray(args.containers) ||
			args.containers.length === 0
		) {
			throw new Error('Batch expects an array of containers as parameter.');
		}
		
		args.containers.forEach((thisContainer) => {
			if( !(thisContainer instanceof UpdateContainer)) {
				throw new Error('Batch expects containers to be of type UpdateContainer.');
			}
		});
		
		const batchUpdateRequest = new BatchUpdate({
			apiUrl : this.apiUrl,
		});
		
		return batchUpdateRequest.execute({
			containers : args.containers
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
