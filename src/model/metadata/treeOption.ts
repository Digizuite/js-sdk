export class TreeOption {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		this.id = args.id;
		this.value = args.value;
		this.path = args.path;
		this.hasChildren = !!args.hasChildren;
	}
	
	/**
	 *
	 * @param args
	 * @returns {TreeOption}
	 */
	static createFromAPIResponse(args = {}) {
		const item = new TreeOption();
		item.setValueFromAPI(args);
		return item;
	}
	
	/**
	 * Motto of the day: consistency is overrated
	 * @param args
	 */
	setValueFromAPI(args = {}) {
	
		if( args.hasOwnProperty('item_tree_valueid') ) {
			this.id = parseInt(args.item_tree_valueid, 10);
		} else if( args.hasOwnProperty('id') ) {
			this.id = parseInt(args.id, 10);
		}
		
		// IdPath
		if( args.hasOwnProperty('idpath') ) {
			this.path = args.idpath;
		} else if( args.hasOwnProperty('idPath') ) {
			this.path = args.idPath;
		}
		
		// Value
		if( args.hasOwnProperty('metaValue') ) {
			this.value = args.metaValue;
		} else if( args.hasOwnProperty('text') ) {
			this.value = args.text;
		}
		
		this.hasChildren = parseInt(args.Children, 10) > 0;
	}
}