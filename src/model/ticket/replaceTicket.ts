import {IUploadTicketArgs, UploadTicket} from './uploadTicket';
import {Asset} from "../asset";

export interface IReplaceTicketArgs extends IUploadTicketArgs {
    asset: Asset;
}

export class ReplaceTicket extends UploadTicket {
    private asset: Asset;
	
	/**
	 * C-tor
	 * @param args
	 */
    constructor(args: IReplaceTicketArgs) {
		super(args);
		this.asset = args.asset;
	}
	
}