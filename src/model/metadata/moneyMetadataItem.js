import {StringMetadataItem} from './stringMetadataItem';

export class MoneyMetadataItem extends StringMetadataItem {
	
	static get TYPE() { return 62; }
	static get VALUE_TYPE() { return 1; }
	
	get TYPE() { return StringMetadataItem.TYPE; }
	get VALUE_TYPE() { return StringMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
}