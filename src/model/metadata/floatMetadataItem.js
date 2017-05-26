import {MetadataItem} from './metadataItem';

export class FloatMetadataItem extends MetadataItem {
	
	static get TYPE() {
		return 82;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = this.value ? parseFloat(this.value) : null;
	}
	
}