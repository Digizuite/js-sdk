import {MetadataItem} from './metadataItem';

export class StringMetadataItem extends MetadataItem {
	
	static get TYPE() {
		return 60;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
	}
	
}