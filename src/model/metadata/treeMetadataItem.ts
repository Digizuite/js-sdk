import {ISetValueFromApiArgs, MetadataItem} from './metadataItem';
import {TreeOption} from './treeOption';

export class TreeMetadataItem extends MetadataItem<TreeOption[]> {

	static get TYPE() {
		return 300;
	}

	static get VALUE_TYPE() {
		return 6;
	}

	get TYPE() {
		return TreeMetadataItem.TYPE;
	}

	get VALUE_TYPE() {
		return TreeMetadataItem.VALUE_TYPE;
	}

	/**
	 * Set values from the API
	 * @param args
	 */
	public setValueFromAPI(args: ISetValueFromApiArgs) {
		super.setValueFromAPI(args);

		const value = Array.isArray(args.item_metafield_valueid) ? args.item_metafield_valueid : [];
		this.value = value.map((thisTreeOption) => TreeOption.createFromAPIResponse(thisTreeOption));
	}

	/**
	 * Append a value to the tree
	 * @param treeOption
	 */
	public appendOption(treeOption: TreeOption) {
		this.appendOptions([treeOption]);
	}

	/**
	 * Appends a series of values to the tree
	 * @param treeOptions
	 */
	public appendOptions(treeOptions: TreeOption[]) {

		const newValues: TreeOption[] = [];

		// Verify that the option is not already in the value
		treeOptions.forEach((thisOption) => {

			const index = this.value!.findIndex((thisExistingOption) => thisExistingOption.id === thisOption.id);

			if (index === -1) {
				newValues.push(thisOption);
			}
		});

		if (newValues.length) {
			this.setValue(this.value!.concat(newValues));
		}
	}

	/**
	 * Set Values
	 * @param treeOptions
	 */
	public setValue(treeOptions: TreeOption[]) {

		if (!Array.isArray(treeOptions)) {
			throw new Error('setValue expect treeOptions to be an array!');
		}

		treeOptions.forEach((thisTreeOption) => {
			if (!(thisTreeOption instanceof TreeOption)) {
				throw new Error('setValue requires that values of treeOptions be instances of TreeOption');
			}
		});

		this.value = treeOptions;
	}

	/**
	 * Remove a combo option
	 * @param treeOption
	 */
	public removeOption(treeOption: TreeOption) {

		if (!(treeOption instanceof TreeOption)) {
			throw new Error('removeOption requires that values of treeOption be instances of TreeOption');
		}

		this.value = this.value!.filter((thisTreeOption) => thisTreeOption.id !== treeOption.id);
	}

	/**
	 * Remove a combo option
	 * @param treeOptions
	 */
	public removeOptions(treeOptions: TreeOption) {

		if (!Array.isArray(treeOptions)) {
			throw new Error('removeOptions expect treeOptions to be an array!');
		}

		treeOptions.forEach((thisTreeOption) => {
			this.removeOption(thisTreeOption);
		});
	}

	/**
	 * Clear value
	 */
	public clearValue() {
		this.value = [];
	}

	/**
	 * Get batch value
	 * @returns {Array}
	 */
	public getUpdateValue() {
		return this.value!.map((thisTreeOption) => thisTreeOption.id);
	}

}
