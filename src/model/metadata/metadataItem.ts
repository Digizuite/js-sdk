export interface IMetadataItemArgs<T> {
	guid: string,
	name: string,
	labelId: string,
	required: string|number|boolean,
	value: T
}

export interface ISetValueFromApiArgs {
	metafieldid: {
		metafieldItemGuid: string;
		metafieldName: string;
		metafieldIsRequired: string;
	};
	metafieldLabelId: string;
	item_metafield_valueid?: any[];
}

export class MetadataItem<T> {

	private guid: string;
	private name: string;
	private labelId: number;
	private required: boolean;
	protected value: T;

	/**
	 *
	 * @param args
	 */
	constructor( args: IMetadataItemArgs<T>) {
		this.guid = args.guid;
		this.name = args.name;
		this.labelId = args.labelId;
		this.required = !!args.required;
		this.value = args.value;
	}
	
	/**
	 *
	 * @param args
	 * @returns {*}
	 */
	static createFromAPIResponse( args = {} ) {
		const item = new this(args);
		item.setValueFromAPI(args);
		return item;
	}
	
	/**
	 *
	 * @param args
	 */
	setValueFromAPI( args: ISetValueFromApiArgs) {
		this.guid  = args.metafieldid.metafieldItemGuid;
		this.name = args.metafieldid.metafieldName;
		this.labelId = parseInt(args.metafieldLabelId, 10);
		this.required = !!parseInt(args.metafieldid.metafieldIsRequired, 10);
		this.value = Array.isArray(args.item_metafield_valueid) ? args.item_metafield_valueid[0].metaValue : '';
	}
	
	/**
	 * Clears a value
	 */
	clearValue() {
		this.value = null;
	}
	
	/**
	 * Sets a value
	 * @param value
	 */
	setValue(value) {
		this.value = value;
	}
	
	/**
	 * Returns the value of the item
	 * @returns {*}
	 */
	getValue() {
		return this.value;
	}
	
	/**
	 * Returns the batch value of the item
	 * @returns {*}
	 */
	getUpdateValue() {
		return this.getValue();
	}
	
}