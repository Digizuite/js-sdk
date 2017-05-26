import {MetadataItem} from './metadataItem';

export class MoneyMetadataItem extends MetadataItem {
	
	static get TYPE() {
		return 62;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
}