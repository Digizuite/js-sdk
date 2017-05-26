export class TreeValue {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		this.id = args.id;
		this.value = args.value;
		
	}
	
	/**
	 *
	 * @param args
	 * @returns {TreeValue}
	 */
	static createFromAPIResponse(args = {}) {
		const item = new TreeValue();
		item.setValueFromAPI(args);
		return item;
	}
	
	setValueFromAPI(args = {}) {
		this.id    = parseInt(args.item_tree_valueid, 10);
		this.value = args.metaValue;
	}
}