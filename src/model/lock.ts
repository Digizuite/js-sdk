import {Model} from '../common/model';
import {Member} from './member';

export interface ILockArgs {
	isLocked: boolean | string;
}

export class Lock extends Model {
	public isLocked: boolean;
	public owner: Member | null;

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: ILockArgs) {

		super();

		this.isLocked = !!args.isLocked;
		this.owner = null;

	}

	/**
	 * Populates an asset from with the API values
	 * @param args
	 */
	public setValueFromAPI(args: any) {

		this.isLocked = !!args.isLocked;
		this.owner = new Member({
			id: args.lockedByItemId,
			username: args.lockedByUsername,
		});
	}

}
