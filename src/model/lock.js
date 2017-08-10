import {Model} from '../common/model';

export class Lock extends Model {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		super(args);
		
		this.isLocked = !!args.isLocked;
		this.owner = null;
		
	}
	
	/**
	 * Populates an asset from with the API values
	 * @param args
	 */
	setValueFromAPI( args = {} ) {
		
		this.isLocked = !!args.isLocked;
		this.owner = null;
	}
	
}