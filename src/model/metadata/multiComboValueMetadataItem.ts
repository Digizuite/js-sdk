import {ComboOption} from './comboOption';
import {MetadataItem} from "./metadataItem";

export class MultiComboValueMetadataItem extends MetadataItem<ComboOption[]> {

	constructor(args: any) {
		super(args);
	}

	static get TYPE() {
		return 67;
	}

	static get VALUE_TYPE() {
		return 6;
	}

	get TYPE() {
		return MultiComboValueMetadataItem.TYPE;
	}

	get VALUE_TYPE() {
		return MultiComboValueMetadataItem.VALUE_TYPE;
	}

	public setValueFromAPI(args: any) {

		super.setValueFromAPI(args);

		const value = Array.isArray(args.item_metafield_valueid) ? args.item_metafield_valueid : [];
		this.value = value.map((thisComboValue: any) => ComboOption.createFromAPIResponse(thisComboValue));
	}

	/**
	 * Append a value to the combo
	 * @param comboOption
	 */
	public appendOption(comboOption: ComboOption) {
		this.appendOptions([comboOption]);
	}

	/**
	 * Appends a series of values to the tree
	 * @param comboOptions
	 */
	public appendOptions(comboOptions: ComboOption[]) {
		this.setValue(this.value!.concat(comboOptions));
	}

	/**
	 * Remove a combo option
	 * @param comboOption
	 */
	public removeOption(comboOption: ComboOption) {

		if (!(comboOption instanceof ComboOption)) {
			throw new Error('removeOption requires that values of comboOptions be instances of ComboOption');
		}

		this.value = this.value!.filter((thisComboOption) => thisComboOption.value !== comboOption.value);
	}

	/**
	 * Remove a combo option
	 * @param comboOptions
	 */
	public removeOptions(comboOptions: ComboOption) {

		if (!Array.isArray(comboOptions)) {
			throw new Error('removeOptions expect comboOptions to be an array!');
		}

		comboOptions.forEach((thisComboOption) => {
			this.removeOption(thisComboOption);
		});
	}

	/**
	 * Set Values
	 * @param comboOptions
	 */
	public setValue(comboOptions: ComboOption[] = []) {

		if (!Array.isArray(comboOptions)) {
			throw new Error('setValue expect comboValues to be an array!');
		}

		comboOptions.forEach((thisComboOption) => {
			if (!(thisComboOption instanceof ComboOption)) {
				throw new Error('setValue requires that values of comboOptions be instances of ComboOption');
			}
		});

		this.value = comboOptions;
	}

	public clearValue() {
		this.value = [];
	}

	public getUpdateValue(): any {
		return this.value!.map(thisComboValue => thisComboValue.id);
	}

}
