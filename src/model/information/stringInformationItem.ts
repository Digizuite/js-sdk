import {formatDuration} from '../../utilities/format';
import {IInformationItemArgs, InformationItem} from './informationItem';

export class StringInformationItem extends InformationItem {

	constructor(args: IInformationItemArgs) {
		super(args);
		this.value = '';
	}

	static get TYPE() {
		return 'string';
	}

	get TYPE() {
		return StringInformationItem.TYPE;
	}

	/**
	 * Formats and returns the value
	 * @returns {String}
	 */
	public getFormattedValue() {

		let result;

		switch (this.format) {
			case 'duration' :
				result = formatDuration(this.value);
				break;
			default:
				result = this.value;
				break;
		}

		return result;
	}

}
