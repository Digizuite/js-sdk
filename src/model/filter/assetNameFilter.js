import {StringFilter} from './stringFilter';

export class AssetFreeTextFilter extends StringFilter {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super({
			id : 'freetext',
			value : args.text
		});
	}

}