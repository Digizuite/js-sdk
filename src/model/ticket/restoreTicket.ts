import {IReplaceTicketArgs, ReplaceTicket} from './replaceTicket';

export interface IRestoreTicketArgs extends IReplaceTicketArgs {
	version: any;
}

export class RestoreTicket extends ReplaceTicket {
	public version: any;

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IRestoreTicketArgs) {
		super(args);
		this.version = args.version;
	}

}
