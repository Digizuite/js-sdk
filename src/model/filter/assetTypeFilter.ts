import {IFilterArgs} from './filter';
import {IDArrayFilter} from "./idArrayFilter";

export class AssetTypeFilter extends IDArrayFilter<number> {

    static get TYPE() {
        return 'assettype';
    }

    get TYPE() {
        return AssetTypeFilter.TYPE;
    }

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IFilterArgs) {

	    super({
            parameterName : 'sAssetType',
            ...args
        });

	    if( args.hasOwnProperty('value') ) {
            this.setValue( args.value );
        }
    }

}
