import {MetadataItem} from './metadataItem';
import {UniqueOption} from './uniqueOption';

export class UniqueVersionMetadataItem extends MetadataItem {
	
	static get TYPE() { return 200; }
	static get VALUE_TYPE() { return 16; }
	
	get TYPE() { return UniqueVersionMetadataItem.TYPE; }
	get VALUE_TYPE() { return UniqueVersionMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	/**
	 * Set value from API response
	 * @param args
	 */
	setValueFromAPI( args = {} ) {
		super.setValueFromAPI(args);
		this.value = Array.isArray(args.item_metafield_valueid) ? UniqueOption.createFromAPIResponse(args.item_metafield_valueid[0]) : null;
	}
	
	/**
	 * Sets a value
	 * @param value
	 */
	setValue(value) {
		
		if( !(value instanceof UniqueOption) ) {
			throw new Error('Parameter value needs to be of instance UniqueOption');
		}
		
		super.setValue(value);
	}
	
	/**
	 * Returns the batch value of the item
	 * @returns {*}
	 */
	getUpdateValue() {
		return this.value ? [ this.value.unique, this.value.version ] : [];
	}
}