import {IFilterArgs, IFilterSearchPayload, Filter} from './filter';

export class ArrayFilter extends Filter< Array<string|number> > {

    /**
     * C-tor
     * @param args
     */
    constructor(args: IFilterArgs) {
        super(args);
        this.value = this.value || [];
    }

    /**
     * Push a new values
     * @param {string | number} value
     */
    public appendValue( value : string|number ) {
        this.value.push( String(value) );
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
