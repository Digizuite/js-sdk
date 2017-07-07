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
	
	/**
	 * Set the value
	 * @param value
	 */
	setValue( value ) {
		
		if( !(value instanceof Date) ) {
			throw new Error('Parameter value needs to be of type Date');
		}
		
		super.setValue(value);
	}
	
	/**
	 * Sets value from a string
	 * @param value
	 * @param format
	 */
	setValueFromString( value = '', format = 'DD-MM-YYYY HH:mm:ss' ) {
		
		if( typeof value !== 'string' ) {
			throw new Error('Parameter value needs to be of type string');
		}
		
		this.setValue( fecha.parse(value, format) );
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = this.value ? fecha.parse(this.value, 'DD-MM-YYYY HH:mm:ss') : null;
	}
	
	/**
	 * Returns the value of the item
	 * @returns {string|null}
	 */
	getUpdateValue() {
		const format = 'YYYY-MM-DDTHH:mm:ss.SSS';
		return this.value ? fecha.format(this.value, format): null;
	}
}