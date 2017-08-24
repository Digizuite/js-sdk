import {MetadataItem} from './metadataItem';
import * as fecha from 'fecha';

export class DateTimeMetadataItem extends MetadataItem<Date | null> {


    constructor(args: any) {
        super(args);
    }
	static get VALUE_TYPE() { return 4; }
	
	get TYPE() { return DateTimeMetadataItem.TYPE; }
	get VALUE_TYPE() { return DateTimeMetadataItem.VALUE_TYPE; }

    static get TYPE() {
        return 64;
    }
	
	/**
	 * Set the value
	 * @param value
	 */
    setValue(value: Date) {
		
		if( !(value instanceof Date) ) {
			throw new Error('Parameter value needs to be of type Date');
		}
		
		super.setValue(value);
	}
	
	/**
	 * Sets value from a string
	 * @param value
	 * @param format
	 */
	setValueFromString( value = '', format = 'DD-MM-YYYY HH:mm:ss' ) {
		
		if( typeof value !== 'string' ) {
			throw new Error('Parameter value needs to be of type string');
		}
		
		this.setValue( fecha.parse(value, format) );
	}

    setValueFromAPI(args: any) {
		super.setValueFromAPI(args);
        this.value = this.value ? fecha.parse(<string><any>this.value, 'DD-MM-YYYY HH:mm:ss') : null;
	}
	
	/**
     * Returns the batch value of the item
	 * @returns {string|null}
	 */
    getUpdateValue(): string | null {
		const format = 'YYYY-MM-DDTHH:mm:ss.SSS';
		return this.value ? fecha.format(this.value, format): null;
	}

    clearValue(): void {
        this.value = null;
    }
}