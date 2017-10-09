import {IInformationItemArgs, InformationItem} from './informationItem';

export class ArrayInformationItem extends InformationItem {

	constructor(args: IInformationItemArgs) {
		super(args);
		this.value = [];
	}

	static get TYPE() {
		return 'array';
	}

	get TYPE() {
		return ArrayInformationItem.TYPE;
	}

}
