import {Filter} from './filter';

export class StringFilter extends Filter {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super(args);
		
		if( !args.value ) {
			throw new Error('Expected StringFilter to have a value parameter!');
		}
		
		this.value = args.value;
	}
	
	/**
	 * Export for search payload
	 * @returns {{freetext: *}}
	 */
	getAsSearchPayload() {
		return {
			[this.id] : this.value
		};
	}
	
}