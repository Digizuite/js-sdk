import {UploadTicket} from './uploadTicket';

export class ReplaceTicket extends UploadTicket {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		super(args);
		this.asset = args.asset;
	}
	
}