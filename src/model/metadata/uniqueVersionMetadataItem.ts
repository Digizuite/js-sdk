import {MetadataItem} from './metadataItem';
import {UniqueOption} from './uniqueOption';

export class UniqueVersionMetadataItem extends MetadataItem<UniqueOption | null> {

	static get TYPE() {
		return 200;
	}

	static get VALUE_TYPE() {
		return 16;
	}

	get TYPE() {
		return UniqueVersionMetadataItem.TYPE;
	}

	get VALUE_TYPE() {
		return UniqueVersionMetadataItem.VALUE_TYPE;
	}

	/**
	 * Set value from API response
	 * @param args
	 */
	public setValueFromAPI(args: any) {
		super.setValueFromAPI(args);
		this.value = Array.isArray(args.item_metafield_valueid) ?
			UniqueOption.createFromAPIResponse(args.item_metafield_valueid[0]) : null;
	}

	/**
	 * Sets a value
	 * @param value
	 */
	public setValue(value: UniqueOption) {

		if (!(value instanceof UniqueOption)) {
			throw new Error('Parameter value needs to be of instance UniqueOption');
		}

		super.setValue(value);
	}

	/**
	 * Returns the batch value of the item
	 * @returns {*}
	 */
	public getUpdateValue() {
		return this.value ? [this.value.unique, this.value.version] : [];
	}

	public clearValue(): void {
		this.value = null;
	}
}
