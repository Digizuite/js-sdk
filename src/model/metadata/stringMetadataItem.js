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
	
	/**
	 * Returns the value of the item
	 * @returns {string|null}
	 */
	getValue() {
		return this.value;
	}
	
	/**
	 * Set the value
	 * @param value
	 */
	setValue( value = '' ) {
		if( typeof value !== 'string' ) {
			throw new Error('Parameter value needs to be of type string');
		}
		
		this.value = value;
	}
	
	/**
	 * Clear the value
	 */
	clearValue() {
		this.value = null;
	}
	
}