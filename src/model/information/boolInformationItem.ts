import {IInformationItemArgs, InformationItem} from './informationItem';

export class BoolInformationItem extends InformationItem {

	constructor(args: IInformationItemArgs) {
		super(args);
		this.value = null;
	}

	static get TYPE() {
		return 'bool';
	}

	get TYPE() {
		return BoolInformationItem.TYPE;
	}

	public setValueFromAPI(args: IInformationItemArgs) {
		super.setValueFromAPI(args);
		this.value = args.value === 'true' || args.value === true || args.value === '1' || args.value === 1;
	}

}
