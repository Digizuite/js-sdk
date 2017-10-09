import {Asset} from "../asset";
import {IUploadTicketArgs, UploadTicket} from './uploadTicket';

export interface IReplaceTicketArgs extends IUploadTicketArgs {
	asset: Asset;
}

export class ReplaceTicket extends UploadTicket {
	public asset: Asset;

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IReplaceTicketArgs) {
		super(args);
		this.asset = args.asset;
	}

}
