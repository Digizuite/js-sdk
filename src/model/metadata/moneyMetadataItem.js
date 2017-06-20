import {StringMetadataItem} from './stringMetadataItem';

export class MoneyMetadataItem extends StringMetadataItem {
	
	static get TYPE() { return 62; }
	static get VALUE_TYPE() { return 1; }
	
	get TYPE() { return MoneyMetadataItem.TYPE; }
	get VALUE_TYPE() { return MoneyMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
}