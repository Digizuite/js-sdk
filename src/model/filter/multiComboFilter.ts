import {IFilterArgs, IFilterSearchPayload} from './filter';
import {ComboOption} from "../metadata/comboOption";
import {ArrayFilter} from "./arrayFilter";

export class MultiComboFilter extends ArrayFilter<ComboOption> {

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
     * Returns the search payload
     * @returns {IFilterSearchPayload}
     */
    public getAsSearchPayload(): IFilterSearchPayload {
        return {
            [this.parameterName] : this.getValueForPayload(),
            [`${this.parameterName}_type_multistrings`] : '1'
        };
    }

    /**
     * Get the value for the filter
     * @returns {string}
     */
    protected getValueForPayload(): Array<string> {
        return this.value.map( thisOption => thisOption.value );
    };

}
