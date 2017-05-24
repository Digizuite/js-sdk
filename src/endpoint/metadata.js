import {Endpoint} from 'common/endpoint';

export class Metadata extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {}  ) {
		super(args);
	}
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {Asset} args.asset - Asset for which to get the metadata
	 */
	getMetadataGroups( args = {} ) {
	
		return Promise.resolve(666);
	}
	
}