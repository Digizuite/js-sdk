import {Model} from '../common/model';

export interface IMemberArgs {
    id: number;
    username?: string;
    firstname?: string;
    lastname?: string;
    roles?: string[];
    itemId?: number;
}

export class Member extends Model {
    private id: number;
    private username: string;
    private firstname: string;
    private lastname: string;
    private roles: string[];
    private __itemId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE?: number;
	
	/**
	 * C-tor
	 * @param args
	 */
    constructor(args: IMemberArgs) {

        super();
		
		this.id = args.id;
		this.username = args.username || '';
		this.firstname = args.firstname || '';
		this.lastname = args.lastname || '';
		this.roles = Array.isArray(args.roles) ? args.roles : [];
		this.__itemId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE = args.itemId;
		
	}
	
	/**
	 * Sets values from API
	 * @param args
	 */
    setValueFromAPI(args: any) {
		
		const memberId = parseInt( args.memberId, 10 );
		if( !Number.isNaN(memberId) ) {
			this.id = memberId;
		}
		
		const itemId = parseInt( args.itemId, 10 );
		if( !Number.isNaN(itemId) ) {
			this.__itemId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE = itemId;
		}
		
		this.username = args.username;
		this.firstname = args.firstname;
		this.lastname = args.lastname;
		
		this.roles = args.roles;
		
	}
	
	/**
	 * Checks if the member has a specified role
	 * @param {String} role
	 */
	hasRole( role = '' ) {
		return this.roles.includes(role);
	}
	
}