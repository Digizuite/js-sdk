import {IFilterArgs, IFilterSearchPayload, Filter} from './filter';

import {ComboOption} from "../metadata/comboOption";

export class ComboFilter extends Filter<ComboOption> {

    static get TYPE() {
        return 'combo';
    }

    get TYPE() {
        return ComboFilter.TYPE;
    }

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IFilterArgs) {
		super(args);
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
    protected getValueForPayload(): string {
        return this.value.value as string;
    };

}
