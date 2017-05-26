import {StringMetadataItem} from './stringMetadataItem';

export class LinkMetadataItem extends StringMetadataItem {
	
	static get TYPE() {
		return 350;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
}