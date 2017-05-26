import {MetadataItem} from './metadataItem';

export class IntMetadataItem extends MetadataItem {
	
	static get TYPE() {
		return 51;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = this.value ? parseInt(this.value, 10) : null;
	}
	
}