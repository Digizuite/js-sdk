export class ComboOption {
	
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
	 * @returns {ComboOption}
	 */
	static createFromAPIResponse(args = {}) {
		const item = new ComboOption();
		item.setValueFromAPI(args);
		return item;
	}
	
	/**
	 * Sets values from the API response to itself
	 * @param args
	 */
	setValueFromAPI(args = {}) {
		
		this.id    = parseInt(args.item_combo_valueid, 10);
		
		// Yes, this can be in multiple proprieties.
		if( args.hasOwnProperty('combooptionvalue') ) {
			this.value = args.combooptionvalue;
		} else if( args.hasOwnProperty('optionvalue')  ) {
			this.value = args.optionvalue;
		}
		
	}
}