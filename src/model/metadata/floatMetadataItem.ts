import {MetadataItem} from './metadataItem';

export class FloatMetadataItem extends MetadataItem {
	
	static get TYPE() { return 82; }
	static get VALUE_TYPE() { return 5; }
	
	get TYPE() { return FloatMetadataItem.TYPE; }
	get VALUE_TYPE() { return FloatMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = this.value ? parseFloat(this.value) : null;
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
		
		if( typeof value !== 'number' || Number.isNaN(value)) {
			throw new Error('Parameter value needs to be of type number');
		}
		
		super.setValue(value);
	}
	
}