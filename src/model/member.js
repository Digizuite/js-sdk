import {Model} from '../common/model';

export class Member extends Model {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		super(args);
		
		this.id = args.id;
		this.username = args.username || '';
		
	}
	
	
}