import {IFilterArgs, Filter} from './filter';
import {TreeOption} from "../metadata/treeOption";

export class TreeFilter extends Filter<TreeOption> {

    static get TYPE() {
        return 'tree';
    }

    get TYPE() {
        return TreeFilter.TYPE;
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
