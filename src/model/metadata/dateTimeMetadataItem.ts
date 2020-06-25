import * as fecha from 'fecha';
import {MetadataItem} from './metadataItem';

export class DateTimeMetadataItem extends MetadataItem<Date | null> {

	constructor(args: any) {
		super(args);
	}

	static get VALUE_TYPE() {
		return 4;
	}

	static get TYPE() {
		return 64;
	}

	get TYPE() {
		return DateTimeMetadataItem.TYPE;
	}

	get VALUE_TYPE() {
		return DateTimeMetadataItem.VALUE_TYPE;
	}

	/**
	 * Set the value
	 * @param value
	 */
	public setValue(value: Date) {

		if (!(value instanceof Date)) {
			throw new Error('Parameter value needs to be of type Date');
		}

		super.setValue(value);
	}

	/**
	 * Sets value from a string
	 * @param value
	 * @param format
	 */
	public setValueFromString(value = '', format = 'DD-MM-YYYY HH:mm:ss') {

		if (typeof value !== 'string') {
			throw new Error('Parameter value needs to be of type string');
		}

		this.setValue(fecha.parse(value, format) as Date);
	}

	public setValueFromAPI(args: any) {
		super.setValueFromAPI(args);
		this.value = this.value ? fecha.parse(this.value as any as string, 'DD-MM-YYYY HH:mm:ss') as Date : null;
	}

	/**
	 * Returns the batch value of the item
	 * @returns {string|null}
	 */
	public getUpdateValue(): string | null {
		const format = 'YYYY-MM-DDTHH:mm:ss.SSS';
		return this.value ? fecha.format(this.value, format) : null;
	}

	public clearValue(): void {
		this.value = null;
	}
}
