import {IFilterArgs, IFilterSearchPayload, Filter} from './filter';

export class ArrayFilter<T> extends Filter<Array<any>> {

    /**
     * C-tor
     * @param args
     */
    constructor(args: IFilterArgs) {
        super(args);
        this.value = this.value || [];
    }

    /**
     * Push a value
     * @param {T} value
     */
    public appendValue( value : T ) {
        this.value.push(value);
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
    protected getValueForPayload(): string {
        return this.value.map(String).join(',');
    };

}
