import {StringMetadataItem} from './stringMetadataItem';

export class NoteMetadataItem extends StringMetadataItem {
	
	static get TYPE() { return 70; }
	
	get TYPE() { return NoteMetadataItem.TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = Array.isArray(args.note) ? args.note[0].note : '';
	}
	
}