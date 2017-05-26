export class MetadataItem {
	
	/**
	 *
	 * @param args
	 */
	constructor( args = {} ) {
		this.guid = args.guid;
		this.name = args.name;
		this.required = !!args.required;
		this.value = args.value;
	}
	
	/**
	 *
	 * @param args
	 * @returns {StringMetadataItem}
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
		this.guid  = args.metafieldid.metafieldItemGuid;
		this.name = args.metafieldid.metafieldName;
		this.required = !!parseInt(args.metafieldid.metafieldIsRequired, 10);
		this.value = Array.isArray(args.item_metafield_valueid) ? args.item_metafield_valueid[0].metaValue : '';
	}
	
}