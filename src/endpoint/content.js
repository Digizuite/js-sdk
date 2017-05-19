import {Endpoint} from 'common/endpoint';
import {Folders} from 'request/searchService/folders';

export class Content extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {String} args.metafieldLabelId - metafieldLabelId of the menu
	 */
	constructor( args = {}  ) {
		super(args);
		
		this.metafieldLabelId = args.metafieldLabelId;
	}
	
	/**
	 *
	 * @param args
	 * @returns {Promise}
	 */
	getFolders( args = {} ) {
		
		const foldersRequest = new Folders({
			apiUrl : this.apiUrl
		});
		
		return foldersRequest.execute({
			sfMetafieldLabelId : this.metafieldLabelId,
			path : args.path || '/'
		});
	}
	
}