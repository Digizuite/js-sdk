import {MetadataItem} from './metadataItem';
import fecha from 'fecha';

export class DateTimeMetadataItem extends MetadataItem {
	
	static get TYPE() {
		return 64;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = this.value ? fecha.parse(this.value, 'DD-MM-YYYY HH:mm:ss') : null;
	}
}