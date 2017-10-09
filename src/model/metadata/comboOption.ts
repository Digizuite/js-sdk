export interface IComboOptionArgs {
	combovalue: string;
	metaValue: string;
	item_combo_valueid: string;
	combooptionvalue?: string;
	optionvalue?: string;
}

export class ComboOption {
	public id?: number;
	public value?: string;
	private optionvalue?: string;

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: { id?: number, value?: string, optionvalue?: string } = {}) {

		this.id = args.id;
		this.value = args.value;
		this.optionvalue = args.optionvalue;

	}

	/**
	 *
	 * @param args
	 * @returns {ComboOption}
	 */
	public static createFromAPIResponse(args: IComboOptionArgs) {
		const item = new ComboOption();
		item.setValueFromAPI(args);
		return item;
	}

	/**
	 * Sets values from the API response to itself
	 * @param args
	 */
	public setValueFromAPI(args: IComboOptionArgs) {

		this.id = parseInt(args.item_combo_valueid, 10);

		// Yes, this can be in multiple proprieties.
		if (args.hasOwnProperty('combooptionvalue')) {
			this.optionvalue = args.combooptionvalue;
		} else if (args.hasOwnProperty('optionvalue')) {
			this.optionvalue = args.optionvalue;
		}

		if (args.hasOwnProperty('metaValue')) {
			this.value = args.metaValue;
		} else if (args.hasOwnProperty('combovalue')) {
			this.value = args.combovalue;
		}

	}

}
