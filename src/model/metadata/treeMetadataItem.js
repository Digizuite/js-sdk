import {MetadataItem} from './metadataItem';
import {TreeValue} from 'model/metadata/treeValue';

export class TreeMetadataItem extends MetadataItem {
	
	static get TYPE() {
		return 300;
	}
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		
		const value = Array.isArray(args.item_metafield_valueid) ? args.item_metafield_valueid : [];
		this.value = value.map((thisTreeValue) => TreeValue.createFromAPIResponse(thisTreeValue));
		
	}
	
}