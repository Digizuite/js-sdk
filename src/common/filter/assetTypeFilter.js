import {ArrayFilter} from './arrayFilter';

export class AssetTypeFilter extends ArrayFilter {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super({
			id  : 'sAssetType',
			values : args.types
		});
	}
	
}