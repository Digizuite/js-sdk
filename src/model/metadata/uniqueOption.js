export class UniqueOption {
	
	get unique() {
		return this._unique;
	}
	
	
	get version() {
		return this._version;
	}
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		this._unique = args.unique;
		this._version = args.version;
		
	}
	
	/**
	 *
	 * @param args
	 * @returns {UniqueOption}
	 */
	static createFromAPIResponse(args = {}) {
		const item = new UniqueOption();
		item.setValueFromAPI(args);
		return item;
	}
	
	/**
	 * Set values from API
	 * @param args
	 */
	setValueFromAPI(args = {}) {
		this._unique = args.metaValue;
		this._version = args.extraValue;
		
	}
}