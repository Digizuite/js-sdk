import {MetadataItem} from './metadataItem';

export class IntMetadataItem extends MetadataItem {
	
	static get TYPE() { return 51; }
	static get VALUE_TYPE() { return 3; }
	
	get TYPE() { return IntMetadataItem.TYPE; }
	get VALUE_TYPE() { return IntMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = this.value ? parseInt(this.value, 10) : null;
	}
	
	/**
	 * Clears a value
	 */
	clearValue() {
		this.value = 0;
	}
	
	/**
	 * Sets a value
	 * @param value
	 */
	setValue(value) {
		
		if( !Number.isInteger(value) ) {
			throw new Error('Parameter value needs to be of type number');
		}
		
		super.setValue(value);
	}
	
}