import {IMetadataItemArgs, ISetValueFromApiArgs, MetadataItem} from './metadataItem';

export class BitMetadataItem extends MetadataItem<boolean> {
	
	static get TYPE() { return 61; }
	static get VALUE_TYPE() { return 2; }
	
	get TYPE() { return BitMetadataItem.TYPE; }
	get VALUE_TYPE() { return BitMetadataItem.VALUE_TYPE; }
	
	constructor( args:IMetadataItemArgs<boolean> ) {
		super(args);
	}
	
	setValueFromAPI( args: ISetValueFromApiArgs) {
		super.setValueFromAPI(args);
		this.value = !!parseInt(<string><any>this.value, 10);
	}
	
	/**
	 * Clears a value
	 */
	clearValue() {
		this.value = false;
	}
	
	/**
	 * Sets a value
	 * @param value
	 */
	setValue(value: boolean) {
		
		if( typeof value !== 'boolean' ) {
			throw new Error('Parameter value needs to be of type boolean');
		}
		
		this.value = value;
	}
	
}