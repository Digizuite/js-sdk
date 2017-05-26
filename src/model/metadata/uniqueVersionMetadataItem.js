import {StringMetadataItem} from './stringMetadataItem';

export class UniqueVersionMetadataItem extends StringMetadataItem {
	
	static get TYPE() {
		return 200;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
}