import {InformationItem} from './informationItem';
import {parseDotNetDate} from '../../utilities/helpers/dateTime';
import fecha from 'fecha';

export class DateTimeInformationItem extends InformationItem {
	
	static get TYPE() { return 'datetime'; }
	get TYPE() { return DateTimeInformationItem.TYPE; }
	
	constructor( args = {} ) {
		super(args);
		this.value = null;
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = this.value ? parseDotNetDate(this.value) : null;
	}
	
	/**
	 * Returns a value formatted to the specs
	 * @returns {*}
	 */
	getFormattedValue() {
		return this.value ? fecha.format(this.value, 'DD/MM/YYYY HH:mm') : '';
	}
	
}