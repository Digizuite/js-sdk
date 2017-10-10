export interface IFilterArgs {
    label?: string;
    parameterName?: string;
    value?: any;
}

export interface IFilterSearchPayload {
	[key : string] : string
}

export abstract class Filter<T> {

    public label: string;
    public parameterName: string;
	protected value: T;

    /**
	 * C-tor
     * @param {IFilterArgs} args
     */
	constructor(args: IFilterArgs) {

		this.parameterName = args.parameterName || '';
		this.label = args.label || '';
		this.value = args.value;
	}

    /**
	 * Setter for value
     * @param {T} v
     */
	public setValue( v : T ) {
		this.value = v;
	}

    /**
	 * Get the value
     * @returns {T}
     */
    public getValue() : T {
        return this.value;
    }


    /**
	 *
     * @param args
     */
	public setValueFromAPI(args: any) {
        this.parameterName = args.parameterName;
	}

    /**
	 * Generic method, shall be overwritten
     * @returns {{[p: string]: string}}
     */
	public getAsSearchPayload(): IFilterSearchPayload {
		return {
			[this.parameterName] : this.getValueForPayload()
		};
	}

    /**
	 * Get the value for the filter
     * @returns {string}
     */
	protected getValueForPayload(): string {
		return String(this.value);
	};
}
