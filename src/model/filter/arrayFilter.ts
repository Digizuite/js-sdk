import {Filter} from './filter';

export class ArrayFilter extends Filter {

	private values: any[];

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: {values: any[], id: string}) {
		super(args);
		
		if( !args.values ) {
			throw new Error('Expected StringFilter to have a values parameter!');
		}
		
		this.values = args.values;
	}
	
	/**
	 * Export for search payload
	 */
	getAsSearchPayload(): {[key: string]: any} {
		return {
			[this.id] : this.values.join(','),
			[`${this.id}_type_multiids`]: 1
		};
	}
	
}