export class ComboValue {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		
		this.id    = args.id;
		this.value = args.value;
		
	}
	
	/**
	 *
	 * @param args
	 * @returns {ComboValue}
	 */
	static createFromAPIResponse(args = {}) {
		const item = new ComboValue();
		item.setValueFromAPI(args);
		return item;
	}
	
	setValueFromAPI(args = {}) {
		this.id    = parseInt(args.item_combo_valueid, 10);
		this.value = args.combooptionvalue;
	}
}