import {IFilterArgs, IFilterSearchPayload, Filter} from './filter';
import {ComboOption} from "../metadata/comboOption";

export class MultiComboFilter extends Filter< Array<ComboOption> > {

    static get TYPE() {
        return 'multicombo';
    }

    get TYPE() {
        return MultiComboFilter.TYPE;
    }

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
    public appendValue( value : ComboOption ) {
        this.value.push( value );
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
