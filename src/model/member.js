export class Member {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		this.id = args.id;
		this._roles = args.roles;
	}
	
	/**
	 * Create an instance from an API response
	 * @param args
	 * @returns {Member}
	 */
	static createFromAPIResponse( args = {} ) {
		const member = new Member();
		member.setValueFromAPI(args);
		return member;
	}
	/**
	 * Populates an asset from with the API values
	 * @param args
	 */
	setValueFromAPI( args = {} ) {
	
		this.id = parseInt( args.memberItemId, 10 );
		this._roles = args.roles;
	
	}
	
}