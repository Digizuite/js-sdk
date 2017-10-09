import {IInformationItemArgs} from './informationItem';
import {StringInformationItem} from './stringInformationItem';

export class LinkInformationItem extends StringInformationItem {

	constructor(args: IInformationItemArgs) {
		super(args);
	}

	static get TYPE() {
		return 'url';
	}

	get TYPE() {
		return LinkInformationItem.TYPE;
	}

}
