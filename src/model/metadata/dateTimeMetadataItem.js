import {MetadataItem} from './metadataItem';
import fecha from 'fecha';

export class DateTimeMetadataItem extends MetadataItem {
	
	static get TYPE() { return 64; }
	static get VALUE_TYPE() { return 4; }
	
	get TYPE() { return DateTimeMetadataItem.TYPE; }
	get VALUE_TYPE() { return DateTimeMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = this.value ? fecha.parse(this.value, 'DD-MM-YYYY HH:mm:ss') : null;
	}
	
	/**
	 * Returns the value of the item
	 * @returns {string|null}
	 */
	getBatchValue() {
		const format = 'YYYY-MM-DDTHH:mm:ss.SSS';
		return this.value ? fecha.format(this.value, format): null;
	}
}