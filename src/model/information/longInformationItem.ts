import {IntInformationItem} from './intInformationItem';

export class LongInformationItem extends IntInformationItem {

	static get TYPE() {
		return 'long';
	}

	get TYPE() {
		return LongInformationItem.TYPE;
	}

}
