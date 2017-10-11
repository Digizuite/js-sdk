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
     * Get the value for the filter
     * @returns {string}
     */
    protected getValueForPayload(): string {
        return this.value.map( thisOption => thisOption.id ).join(',');
    };

}
