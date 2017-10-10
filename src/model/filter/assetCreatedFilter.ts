import {DateBetweenFilter} from './dateBetweenFilter';
import {IFilterArgs} from './filter';

export class AssetCreatedFilter extends DateBetweenFilter {

    /**
     *
     * @param {IFilterArgs} args
     */
	constructor(args : IFilterArgs) {
        super({
            parameterName: 'sDateBetween',
            ...args
        });

		if(args.value) {
		    this.setValue(args.value);
        }
	}

}
