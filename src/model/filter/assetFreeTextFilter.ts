import {StringFilter} from './stringFilter';
import {IFilterArgs} from './filter';

export class AssetFreeTextFilter extends StringFilter {

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IFilterArgs) {

	    super({
            parameterName : 'freetext',
            ...args
        });

        if( args.hasOwnProperty('value') ) {
            this.setValue( args.value );
        }

	}

}
