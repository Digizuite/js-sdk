import {MetadataItem} from './metadataItem';
import {UniqueOption} from './uniqueOption';

export class UniqueVersionMetadataItem extends MetadataItem {
	
	static get TYPE() { return 200; }
	static get VALUE_TYPE() { return 1; }
	
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
	
	
}