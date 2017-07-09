import {Filter} from './filter';

import '../../polyfills/string';

export class DateFilter extends Filter {
	private from: number;
	private to: number;
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: {from: number, to: number, id: string}) {
		super(args);
		
		if( !args.from && !args.to) {
			throw new Error('Expected DateFilter to have a from or a to parameter!');
		}
		
		this.from = args.from;
		this.to = args.to;
	}
	
	/**
	 * Export for search payload
	 * @returns {{freetext: *}}
	 */
	getAsSearchPayload() {
		return {
			[this.id] : DateFilter._unixToDotNetTime(this.from),
			[`${this.id}_type_date`] : `${this.id}_end`,
			[`${this.id}_end`] : DateFilter._unixToDotNetTime(this.to)
		};
	}
	
	/**
	 *
	 * @param time
	 * @returns {string}
	 */
	private static _unixToDotNetTime( time: number ): string {
		
		const date = new Date(time*1000);

		const dateString = date.toISOString();

		return dateString.substr(0, dateString.length - 1); // We need to get rid of the 'Z' at the end
	}
}