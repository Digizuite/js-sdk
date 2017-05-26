import {ComboValueMetadataItem} from './comboValueMetadataItem';

export class MultiComboValueMetadataItem extends ComboValueMetadataItem {
	
	static get TYPE() {
		return 67;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
}