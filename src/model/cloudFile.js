export class CloudFile {
	
	constructor( args = {} ) {
		this.location = args.location;
		this.size = args.size;
		this.name = args.name ? args.name : this._getNameFromLocation(args.location);
	}
	
	/**
	 * Returns a name from location
	 * @param {string} location
	 * @returns {string}
	 * @private
	 */
	_getNameFromLocation( location ) {
		return location.substring( location.lastIndexOf('/') + 1 );
	}
}