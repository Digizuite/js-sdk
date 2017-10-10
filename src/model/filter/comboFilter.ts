import {IFilterArgs, Filter} from './filter';
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
     * Get the value for the filter
     * @returns {string}
     */
    protected getValueForPayload(): string {
        return this.value ? '1' : '0';
    };

}
