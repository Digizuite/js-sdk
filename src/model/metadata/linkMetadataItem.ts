import {StringMetadataItem} from './stringMetadataItem';

export class LinkMetadataItem extends StringMetadataItem {
	
	static get TYPE() { return 350; }
	
	get TYPE() { return LinkMetadataItem.TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	/**
	 *
	 * @param value
	 */
	setValue( value = '' ) {
		// If you feel masochistic, you are more than welcome to validate
		// and check if it is a real link. Good luck, you are on your own with that.
		super.setValue(value);
	}
	
}