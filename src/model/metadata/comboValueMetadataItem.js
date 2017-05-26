import {MetadataItem} from './metadataItem';

export class ComboValueMetadataItem extends MetadataItem {
	
	static get TYPE() {
		return 68;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
}