import {InformationItem} from './informationItem';
import {formatDuration} from '../../utilities/format';

export class StringInformationItem extends InformationItem {
	
	static get TYPE() { return 'string'; }
	get TYPE() { return StringInformationItem.TYPE; }
	
	constructor( args = {} ) {
		super(args);
		this.value = '';
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
	}
	
	/**
	 * Formats and returns the value
	 * @returns {String}
	 */
	getFormattedValue() {
		
		let result;
		
		switch( this._format ) {
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