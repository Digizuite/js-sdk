import {IFilterArgs} from './filter';
import {TreeOption} from "../metadata/treeOption";
import {IDArrayFilter} from "./idArrayFilter";

export class TreeFilter extends IDArrayFilter<TreeOption> {

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
        return this.value.map( thisOption => thisOption.id ).join(',');
    };

}
