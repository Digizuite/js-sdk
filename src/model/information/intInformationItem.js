import {InformationItem} from './informationItem';
import {formatSize} from '../../utilities/format';

export class IntInformationItem extends InformationItem {
	
	static get TYPE() { return 'int'; }
	get TYPE() { return IntInformationItem.TYPE; }
	
	constructor( args = {} ) {
		super(args);
		this.value = null;
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = parseInt( args.value, 10 );
	}
	
	/**
	 * Formats and returns the value
	 * @returns {String}
	 */
	getFormattedValue() {
		
		let result;
		
		switch( this._format ) {
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