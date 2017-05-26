import {MetadataItem} from './metadataItem';

export class NoteMetadataItem extends MetadataItem {
	
	static get TYPE() {
		return 70;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = Array.isArray(args.note) ? args.note[0].note : '';
	}
	
}