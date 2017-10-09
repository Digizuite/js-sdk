import {formatSize} from '../../utilities/format';
import {IInformationItemArgs, InformationItem} from './informationItem';

export class IntInformationItem extends InformationItem {

	constructor(args: IInformationItemArgs) {
		super(args);
		this.value = null;
	}

	static get TYPE() {
		return 'int';
	}

	get TYPE() {
		return IntInformationItem.TYPE;
	}

	public setValueFromAPI(args: IInformationItemArgs) {
		super.setValueFromAPI(args);
		this.value = parseInt(args.value, 10);
	}

	/**
	 * Formats and returns the value
	 * @returns {String}
	 */
	public getFormattedValue(): string {

		let result;

		switch (this.format) {
			case 'fileSize' :
				result = formatSize(this.value);
				break;
			default:
				result = this.value;
				break;
		}

		return result;
	}

}
