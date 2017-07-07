export class Model {
	
	/**
	 *
	 * @param {Object} args
	 */
	constructor( args = {} ) { }
	
	/**
	 *
	 * @param {Object} args
	 * @returns {*}
	 */
	static createFromAPIResponse( args = {} ) {
		const item = new this();
		item.setValueFromAPI(args);
		return item;
	}
	
	/**
	 *
	 * @param {Object} args
	 */
	setValueFromAPI( args = {}) { }
	
}