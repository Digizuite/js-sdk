import {ComboOption} from './comboOption';
import {IMetadataItemArgs, ISetValueFromApiArgs, MetadataItem} from './metadataItem';

export class ComboValueMetadataItem extends MetadataItem<ComboOption | null> {

	constructor(args: IMetadataItemArgs<ComboOption>) {
		super(args);
	}

	static get TYPE() {
		return 68;
	}

	static get VALUE_TYPE() {
		return 3;
	}

	get TYPE() {
		return ComboValueMetadataItem.TYPE;
	}

	get VALUE_TYPE() {
		return ComboValueMetadataItem.VALUE_TYPE;
	}

	/**
	 * Sets value from API
	 * @param args
	 */
	public setValueFromAPI(args: ISetValueFromApiArgs) {

		super.setValueFromAPI(args);

		this.value = Array.isArray(args.item_metafield_valueid) ?

			ComboOption.createFromAPIResponse(args.item_metafield_valueid[0]) :
			null;

	}

	public clearValue(): void {
		this.value = null;
	}

	/**
	 * Sets a value
	 * @param {ComboOption} comboOption
	 */
	public setValue(comboOption: ComboOption) {

		if (!(comboOption instanceof ComboOption)) {
			throw new Error('setValue expects comboOption to be instance of ComboOption.');
		}

		super.setValue(comboOption);
	}

	public getUpdateValue(): any {
		return this.value ? this.value.id : null;
	}

}
