import {IFilterArgs} from './filter';
import {ArrayFilter} from "./arrayFilter";

export class IDArrayFilter<T> extends ArrayFilter<T> {

    /**
     * C-tor
     * @param args
     */
    constructor(args: IFilterArgs) {
        super(args);
    }

    protected getMultiTypeForPayload() {
        return { [`${this.parameterName}_type_multiids`] : '1' };
    }

    /**
     * Get the value for the filter
     * @returns {string}
     */
    protected getValueForPayload(): string {
        return this.value.map(String).join(',');
    };
}
