import {MultiComboValueMetadataItem} from './multiComboValueMetadataItem';
import {ComboValue} from 'model/metadata/comboValue';

export class EditMultiComboValueMetadataItem extends MultiComboValueMetadataItem {
	
	static get TYPE() {
		return 169;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);

		const value = Array.isArray(args.item_metafield_valueid) ? args.item_metafield_valueid : [];
		this.value = value.map((thisComboValue) => ComboValue.createFromAPIResponse(thisComboValue));
		
	}
	
}