import {IFilterArgs} from './filter';
import {ComboOption} from "../metadata/comboOption";
import {StringArrayFilter} from "./stringArrayFilter";

export class MultiComboFilter extends StringArrayFilter<ComboOption> {

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
    protected getValueForPayload(): Array<string> {
        return this.value.map( thisOption => thisOption.value as string );
    };

}
