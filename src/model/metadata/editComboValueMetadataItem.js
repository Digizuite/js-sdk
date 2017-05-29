import {ComboValueMetadataItem} from './comboValueMetadataItem';
import {ComboValue} from './comboValue';

export class EditComboValueMetadataItem extends ComboValueMetadataItem {
	
	static get TYPE() {
		return 69;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
	
	setValueFromAPI(args = {}) {
		
		super.setValueFromAPI(args);
		
		this.value = Array.isArray(args.item_metafield_valueid) ?
			ComboValue.createFromAPIResponse(args.item_metafield_valueid[0]) :
			null;
		
	}
	
}