import {ReplaceTicket} from './replaceTicket';

export class RestoreTicket extends ReplaceTicket {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		super(args);
		this.version = args.version;
	}
	
}