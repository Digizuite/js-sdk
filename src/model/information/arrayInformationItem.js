import {InformationItem} from './informationItem';

export class ArrayInformationItem extends InformationItem {
	
	static get TYPE() { return 'array'; }
	get TYPE() { return ArrayInformationItem.TYPE; }
	
	constructor( args = {} ) {
		super(args);
		this.value = [];
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
	}
	
}