import * as fecha from 'fecha';
import {parseDotNetDate} from '../../utilities/helpers/dateTime';
import {IInformationItemArgs, InformationItem} from './informationItem';

export class DateTimeInformationItem extends InformationItem {

	constructor(args: IInformationItemArgs) {
		super(args);
		this.value = null;
	}

	static get TYPE() {
		return 'datetime';
	}

	get TYPE() {
		return DateTimeInformationItem.TYPE;
	}

	public setValueFromAPI(args: IInformationItemArgs) {
		super.setValueFromAPI(args);
		this.value = this.value ? parseDotNetDate(this.value) : null;
	}

	/**
	 * Returns a value formatted to the specs
	 * @returns {*}
	 */
	public getFormattedValue(): string {
		return this.value ? fecha.format(this.value, 'DD/MM/YYYY HH:mm') : '';
	}
}
