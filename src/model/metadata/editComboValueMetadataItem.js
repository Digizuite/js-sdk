import {ComboValueMetadataItem} from './comboValueMetadataItem';

export class EditComboValueMetadataItem extends ComboValueMetadataItem {
	
	static get TYPE() {
		return 69;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
}