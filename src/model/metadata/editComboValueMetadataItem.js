import {ComboValueMetadataItem} from './comboValueMetadataItem';

export class EditComboValueMetadataItem extends ComboValueMetadataItem {
	
	static get TYPE() { return 69; }
	static get VALUE_TYPE() { return 1; }
	
	get TYPE() { return EditComboValueMetadataItem.TYPE; }
	get VALUE_TYPE() { return EditComboValueMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	getBatchValue() {
		return this.value ? this.value.value : null;
	}
	
}