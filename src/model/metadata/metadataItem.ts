export interface IMetadataItemArgs<T> {
	guid?: string;
	name?: string;
	labelId?: number;
	required?: string | number | boolean;
	value?: T;
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

export abstract class MetadataItem<T> {

	protected value?: T;
	private guid?: string;
	private name?: string;
	private labelId?: number;
	private required?: boolean;

	/**
	 *
	 * @param args
	 */
	constructor(args: IMetadataItemArgs<T>) {
		this.guid = args.guid;
		this.name = args.name;
		this.labelId = args.labelId;
		this.required = !!args.required;
		this.value = args.value;
	}

	/**
	 *
	 * @param args
	 */
	public setValueFromAPI(args: ISetValueFromApiArgs) {
		this.guid = args.metafieldid.metafieldItemGuid;
		this.name = args.metafieldid.metafieldName;
		this.labelId = parseInt(args.metafieldLabelId, 10);
		this.required = !!parseInt(args.metafieldid.metafieldIsRequired, 10);
		this.value = Array.isArray(args.item_metafield_valueid) ? args.item_metafield_valueid[0].metaValue : '';
	}

	/**
	 * Clears a value
	 */
	public abstract clearValue(): void;

	/**
	 * Sets a value
	 * @param value
	 */
	public setValue(value: T) {
		this.value = value;
	}

	/**
	 * Returns the value of the item
	 * @returns {*}
	 */
	public getValue(): T | undefined {
		return this.value;
	}

	/**
	 * Returns the batch value of the item
	 * @returns {*}
	 */
	public getUpdateValue(): any {
		return this.getValue();
	}

}
