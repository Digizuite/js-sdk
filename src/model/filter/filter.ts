export class Filter {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		
		if(!args.id) {
			throw new Error('Expecting Filter to have id as parameter!');
		}
		
		this.id = args.id;
	}
	
	/**
	 * Generic method. Shall be overwritten
	 * @returns {{}}
	 */
	getAsSearchPayload() {
		return {};
	}
}