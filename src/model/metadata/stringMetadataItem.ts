import {MetadataItem} from './metadataItem';

export class StringMetadataItem extends MetadataItem {
	
	static get TYPE() { return 60; }
	static get VALUE_TYPE() { return 1; }
	
	get TYPE() { return StringMetadataItem.TYPE; }
	get VALUE_TYPE() { return StringMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
		this.value = '';
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
	}
	
	/**
	 * Set the value
	 * @param value
	 */
	setValue( value = '' ) {
		if( typeof value !== 'string' ) {
			throw new Error('Parameter value needs to be of type string');
		}
		
		super.setValue(value);
	}
	
}