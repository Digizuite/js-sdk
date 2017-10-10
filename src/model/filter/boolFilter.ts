import {IFilterArgs, Filter} from './filter';

export class BoolFilter extends Filter<boolean> {

    static get TYPE() {
        return 'bool';
    }

    get TYPE() {
        return BoolFilter.TYPE;
    }

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IFilterArgs) {
		super(args);
		this.value = this.value || false;
	}

    /**
     * Get the value for the filter
     * @returns {string}
     */
    protected getValueForPayload(): string {
        return this.value ? '1' : '0';
    };

}
