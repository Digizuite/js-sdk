import {StringMetadataItem} from './stringMetadataItem';
import {ISetValueFromApiArgs} from "./metadataItem";

export interface INoteMetdataItemArgs extends ISetValueFromApiArgs {
    note?: Array<{ note: string }>;
}

export class NoteMetadataItem extends StringMetadataItem {
	
	static get TYPE() { return 70; }
	
	get TYPE() { return NoteMetadataItem.TYPE; }

    setValueFromAPI(args: INoteMetdataItemArgs) {
		super.setValueFromAPI(args);
		this.value = Array.isArray(args.note) ? args.note[0].note : '';
	}
	
}