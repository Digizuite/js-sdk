import {Filter} from './filter';

export class StringFilter extends Filter {

	private value: string;

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: {id: string, value: string}) {
		super(args);
		
		if( !args.value ) {
			throw new Error('Expected StringFilter to have a value parameter!');
		}
		
		this.value = args.value;
	}
	
	/**
	 * Export for search payload
	 */
	getAsSearchPayload(): {[key: string]: any} {
		return {
			[this.id] : this.value
		};
	}
	
}