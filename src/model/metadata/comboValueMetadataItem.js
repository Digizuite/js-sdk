import {MetadataItem} from './metadataItem';
import {ComboOption} from './comboOption';

export class ComboValueMetadataItem extends MetadataItem {
	
	static get TYPE() {
		return 68;
	}
	
	constructor(args = {}) {
		super(args);
	}
	
	setValueFromAPI(args = {}) {
		
		super.setValueFromAPI(args);
		
		this.value = Array.isArray(args.item_metafield_valueid) ?
			ComboOption.createFromAPIResponse(args.item_metafield_valueid[0]) :
			null;
		
	}
	
}