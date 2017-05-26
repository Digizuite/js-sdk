import {MetadataItem} from './metadataItem';

export class BitMetadataItem extends MetadataItem {
	
	static get TYPE() {
		return 61;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = !!parseInt(this.value, 10);
	}
	
}