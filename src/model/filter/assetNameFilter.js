import {StringFilter} from './stringFilter';

export class AssetNameFilter extends StringFilter {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super({
			id : 'freetext',
			value : args.name
		});
	}

}