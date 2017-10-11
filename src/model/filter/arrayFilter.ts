import {IFilterArgs, IFilterSearchPayload, Filter} from './filter';

export class ArrayFilter<T> extends Filter<Array<T>> {

    /**
     * C-tor
     * @param args
     */
    constructor(args: IFilterArgs) {
        super(args);
        this.value = this.value || [];
    }

    /**
     * Append options
     * @param {Array<T>} options
     */
    public appendOptions( options : Array<T> ) {
        this.setValue(this.value!.concat(options));
    }

    /**
     * Push a value
     * @param {T} option
     */
    public appendOption( option : T ) {
        this.appendOptions([option]);
    }

    /**
     * Returns the search payload
     * @returns {IFilterSearchPayload}
     */
    public getAsSearchPayload(): IFilterSearchPayload {
        return {
            ...super.getAsSearchPayload(),
            [`${this.parameterName}_type_multiids`] : '1'
        };
    }

    /**
     * Get the value for the filter
     * @returns {string}
     */
    protected getValueForPayload(): string|Array<string> {
        return this.value.map(String).join(',');
    };

}
