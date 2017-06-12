export class PermissionError extends Error {
	
	/**
	 * Error c-tor
	 * @param message
	 * @param code
	 */
	constructor( message = '' , code = 0 ) {
		super();
		this.message = message;
		this.code = code;
	}
	
}