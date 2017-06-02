import {Filter} from './filter';

export class DateFilter extends Filter {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
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
			[this.id] : this._unixToDotNetTime(this.from),
			[`${this.id}_type_date`] : `${this.id}_end`,
			[`${this.id}_end`] : this._unixToDotNetTime(this.to)
		};
	}
	
	/**
	 *
	 * @param time
	 * @returns {string}
	 * @private
	 */
	_unixToDotNetTime( time ) {
		
		const date = new Date(time*1000);
		
		const dateParts = [];
		const timeParts = [];
		
		dateParts.push( date.getFullYear() );
		dateParts.push( String(date.getMonth()+1).padStart(2, '0') );
		dateParts.push( String(date.getDate()).padStart(2, '0') );
		
		timeParts.push( String(date.getHours()).padStart(2, '0') );
		timeParts.push( String(date.getMinutes()).padStart(2, '0') );
		timeParts.push( String(date.getSeconds()).padStart(2, '0') );
		
		return `${dateParts.join('-')}T${timeParts.join(':')}.000`;
	}
}