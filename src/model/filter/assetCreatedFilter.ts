import {DateFilter} from './dateFilter';

export class AssetCreatedFilter extends DateFilter {

	/**
	 * C-tor
	 */
	constructor({from = 0, to = Math.floor(Date.now() / 1000)}) {
		super({
			from,
			id: 'sDateBetween',
			to,
		});
	}

}
