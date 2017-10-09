import {IMetadataItemArgs, ISetValueFromApiArgs, MetadataItem} from './metadataItem';

export class BitMetadataItem extends MetadataItem<boolean> {

	constructor(args: IMetadataItemArgs<boolean>) {
		super(args);
	}

	static get TYPE() {
		return 61;
	}

	static get VALUE_TYPE() {
		return 2;
	}

	get TYPE() {
		return BitMetadataItem.TYPE;
	}

	get VALUE_TYPE() {
		return BitMetadataItem.VALUE_TYPE;
	}

	public setValueFromAPI(args: ISetValueFromApiArgs) {
		super.setValueFromAPI(args);
		this.value = !!parseInt(this.value as any as string, 10);
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
	public setValue(value: boolean) {

		if (typeof value !== 'boolean') {
			throw new Error('Parameter value needs to be of type boolean');
		}

		this.value = value;
	}

}
