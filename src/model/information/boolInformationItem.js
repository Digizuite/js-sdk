import {InformationItem} from './informationItem';

export class BoolInformationItem extends InformationItem {
	
	static get TYPE() { return 'bool'; }
	get TYPE() { return BoolInformationItem.TYPE; }
	
	constructor( args = {} ) {
		super(args);
		this.value = null;
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = args.value === 'true' || args.value === true || args.value === '1' || args.value === 1;
	}
	
}