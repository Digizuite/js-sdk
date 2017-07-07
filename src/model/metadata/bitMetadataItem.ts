import {MetadataItem} from './metadataItem';

export class BitMetadataItem extends MetadataItem {
	
	static get TYPE() { return 61; }
	static get VALUE_TYPE() { return 2; }
	
	get TYPE() { return BitMetadataItem.TYPE; }
	get VALUE_TYPE() { return BitMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = !!parseInt(this.value, 10);
	}
	
	/**
	 * Clears a value
	 */
	clearValue() {
		this.value = false;
	}
	
	/**
	 * Sets a value
	 * @param value
	 */
	setValue(value) {
		
		if( typeof value !== 'boolean' ) {
			throw new Error('Parameter value needs to be of type boolean');
		}
		
		this.value = value;
	}
	
}