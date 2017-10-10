import {ArrayFilter} from './arrayFilter';
import {IFilterArgs} from './filter';

export class AssetTypeFilter extends ArrayFilter {

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
