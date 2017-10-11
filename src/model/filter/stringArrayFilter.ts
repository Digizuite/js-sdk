import {IFilterArgs} from './filter';
import {ArrayFilter} from "./arrayFilter";

export class StringArrayFilter extends ArrayFilter<string|number> {

    /**
     * C-tor
     * @param args
     */
    constructor(args: IFilterArgs) {
        super(args);
    }

}
