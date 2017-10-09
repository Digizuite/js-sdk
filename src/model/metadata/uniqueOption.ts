export interface IUniqueOptionArgs {

	version?: string;
	unique?: string;
}

export interface IUniqueVersionSetValueFromApiArgs {
	metaValue: string;
	extraValue: string;
}

export class UniqueOption {
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IUniqueOptionArgs = {}) {

		this._unique = args.unique;
		this._version = args.version;

	}

	// tslint:disable-next-line
	private _unique?: string;

	get unique() {
		return this._unique;
	}

	// tslint:disable-next-line
	private _version?: string;

	get version() {
		return this._version;
	}

	/**
	 *
	 * @param args
	 * @returns {UniqueOption}
	 */
	public static createFromAPIResponse(args: IUniqueVersionSetValueFromApiArgs) {
		const item = new UniqueOption();
		item.setValueFromAPI(args);
		return item;
	}

	/**
	 * Set values from API
	 * @param args
	 */
	public setValueFromAPI(args: IUniqueVersionSetValueFromApiArgs) {
		this._unique = args.metaValue;
		this._version = args.extraValue;

	}
}
