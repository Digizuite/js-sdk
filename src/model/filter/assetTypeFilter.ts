import {ArrayFilter} from './arrayFilter';

export class AssetTypeFilter extends ArrayFilter {

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: { types: number[] }) {
		super({
			id: 'sAssetType',
			values: args.types,
		});
	}

}
