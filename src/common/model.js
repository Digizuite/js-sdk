export class Model {
	
	/**
	 * C-tor
	 */
	constructor() { }
	
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
	 * Set values from API
	 */
	setValueFromAPI() { }
	
}