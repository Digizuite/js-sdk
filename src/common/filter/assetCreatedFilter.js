import {DateFilter} from './dateFilter';

export class AssetCreatedFilter extends DateFilter {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super({
			id  : 'sDateBetween',
			from: args.from ? args.from : 0,
			to  : args.to ? args.to : Math.floor( Date.now() / 1000)
		});
	}

}