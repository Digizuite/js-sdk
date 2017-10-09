import {ISetValueFromApiArgs, MetadataItem} from './metadataItem';

export class IntMetadataItem extends MetadataItem<number | null> {

	static get TYPE() {
		return 51;
	}

	static get VALUE_TYPE() {
		return 3;
	}

	get TYPE() {
		return IntMetadataItem.TYPE;
	}

	get VALUE_TYPE() {
		return IntMetadataItem.VALUE_TYPE;
	}

	public setValueFromAPI(args: ISetValueFromApiArgs) {
		super.setValueFromAPI(args);
		this.value = this.value ? parseInt(this.value as any as string, 10) : null;
	}

	/**
	 * Clears a value
	 */
	public clearValue() {
		this.value = 0;
	}

	/**
	 * Sets a value
	 * @param value
	 */
	public setValue(value: number) {

		if (!Number.isInteger(value)) {
			throw new Error('Parameter value needs to be of type number');
		}

		super.setValue(value);
	}

}
