import {Filter} from './filter';

export class ArrayFilter extends Filter {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super(args);
		
		if( !args.values ) {
			throw new Error('Expected StringFilter to have a values parameter!');
		}
		
		this.values = args.values;
	}
	
	/**
	 * Export for search payload
	 * @returns {{freetext: *}}
	 */
	getAsSearchPayload() {
		return {
			[this.id]                   : this.values.join(','),
			[`${this.id}_type_multiids`]: 1
		};
	}
	
}