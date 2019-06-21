import {IMetadataItemArgs, ISetValueFromApiArgs, MetadataItem} from './metadataItem';

export class SlaveItemReferenceMetadataItem extends MetadataItem<boolean> {

	constructor(args: IMetadataItemArgs<boolean>) {
		super(args);
	}

	static get TYPE() {
		return 81;
	}

	static get VALUE_TYPE() {
		return 6;
	}

	get TYPE() {
		return SlaveItemReferenceMetadataItem.TYPE;
	}

	get VALUE_TYPE() {
		return SlaveItemReferenceMetadataItem.VALUE_TYPE;
	}

	public setValueFromAPI(args: ISetValueFromApiArgs) {
		this.value = false;
	}

	/**
	 * Clears a value
	 */
	public clearValue() {
		this.value = false;
	}

	/**
	 * Sets a value
	 * @param value
	 */
	public setValue(value: any) {
		this.value = false;
	}

}
