import {Model} from '../common/model';

export class Folder extends Model {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		super(args);
		
		this.path = args.path;
		this.name = args.name;
		this.hasChildren = !!args.hasChildren;
		this.writable = !!args.writable;
		
	}
	
	/**
	 * Populates an asset from with the API values
	 * @param args
	 */
	setValueFromAPI(args = {}) {
		this.path        = args.idPath;
		this.name        = args.text;
		this.hasChildren = parseInt(args.Children, 10) > 0;
		this.writable    = parseInt(args.writeaccess, 10) === 1;
	}
	
}