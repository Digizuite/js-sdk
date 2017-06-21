import {MultiComboValueMetadataItem} from './multiComboValueMetadataItem';

export class EditMultiComboValueMetadataItem extends MultiComboValueMetadataItem {
	
	static get TYPE() { return 169; }
	static get VALUE_TYPE() { return 17; }
	
	get TYPE() { return EditMultiComboValueMetadataItem.TYPE; }
	get VALUE_TYPE() { return EditMultiComboValueMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	getUpdateValue() {
		return this.value.map( thisComboValue => thisComboValue.value );
	}
	
}