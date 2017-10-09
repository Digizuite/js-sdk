export interface IInformationItemArgs {
	id: any;
	label: any;
	value: any;
	pattern: any;
	format: any;
}

export class InformationItem {
	public id: any;
	public name: any;
	public value: any;
	protected pattern: any;
	protected format: any;

	/**
	 *
	 * @param args
	 */
	constructor(args: IInformationItemArgs) {
		this.id = args.id;
		this.name = args.label;
		this.value = args.value;
		this.pattern = args.pattern;
		this.format = args.format;
	}

	/**
	 * Returns a value formatted to the specs
	 * @returns {*}
	 */
	public getFormattedValue() {
		return this.value;
	}

	/**
	 *
	 * @param args
	 */
	public setValueFromAPI(args: IInformationItemArgs) {
		this.id = args.id;
		this.name = args.label || args.id;
		this.value = args.value || '';
		this.pattern = args.pattern;
		this.format = args.format;
	}

}
