export class UniqueOption {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		this.unique = args.unique;
		this.version = args.version;
		
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
		this.unique = args.metaValue;
		this.version = args.extraValue;
		
	}
}