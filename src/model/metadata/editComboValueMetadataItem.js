import {ComboValueMetadataItem} from './comboValueMetadataItem';
import {ComboOption} from './comboOption';

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
			ComboOption.createFromAPIResponse(args.item_metafield_valueid[0]) :
			null;
		
	}
	
}