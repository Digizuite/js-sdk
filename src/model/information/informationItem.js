export class InformationItem {

	/**
	 *
	 * @param args
	 */
	constructor( args = {} ) {
		this.id = args.id;
		this.label = args.label;
		this.value = args.value;
		this._pattern = args.pattern;
		this._format = args.format;
	}
	
	/**
	 * Returns a value formatted to the specs
	 * @returns {*}
	 */
	getFormattedValue() {
		return this.value;
	}
	
	/**
	 *
	 * @param args
	 * @returns {*}
	 */
	static createFromAPIResponse( args = {} ) {
		const item = new this();
		item.setValueFromAPI(args);
		return item;
	}
	
	/**
	 *
	 * @param args
	 */
	setValueFromAPI( args = {}) {
		this.id  = args.id;
		this.label  = args.label || '';
		this.value = args.value || '';
		this._pattern = args.pattern;
		this._format = args.format;
	}
	
}