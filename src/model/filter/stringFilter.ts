import {IFilterArgs, Filter} from './filter';

export class StringFilter extends Filter<string> {

    static get TYPE() {
        return 'string';
    }

    get TYPE() {
        return StringFilter.TYPE;
    }

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IFilterArgs) {
		super(args);
		this.value = this.value || '';
	}

}
