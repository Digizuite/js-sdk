import {IMetadataItemArgs, MetadataItem} from './metadataItem';

export class StringMetadataItem extends MetadataItem<string> {

	constructor(args: IMetadataItemArgs<string>) {
		super(args);
		this.value = '';
	}

	static get TYPE() {
		return 60;
	}

	static get VALUE_TYPE() {
		return 1;
	}

	get TYPE() {
		return StringMetadataItem.TYPE;
	}

	get VALUE_TYPE() {
		return StringMetadataItem.VALUE_TYPE;
	}

	public clearValue(): void {
		this.value = '';
	}

	/**
	 * Set the value
	 * @param value
	 */
	public setValue(value = '') {
		if (typeof value !== 'string') {
			throw new Error('Parameter value needs to be of type string');
		}

		super.setValue(value);
	}

}
