import {ComboValueMetadataItem} from './comboValueMetadataItem';
import {ComboOption} from './comboOption';

export class MultiComboValueMetadataItem extends ComboValueMetadataItem {
	
	static get TYPE() { return 67; }
	static get VALUE_TYPE() { return 6; }
	
	get TYPE() { return MultiComboValueMetadataItem.TYPE; }
	get VALUE_TYPE() { return MultiComboValueMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI(args = {}) {
		
		super.setValueFromAPI(args);
		
		
		const value = Array.isArray(args.item_metafield_valueid) ? args.item_metafield_valueid : [];
		this.value = value.map((thisComboValue) => ComboOption.createFromAPIResponse(thisComboValue));
	}
	
	/**
	 * Append a value to the combo
	 * @param comboOption
	 */
	appendOption( comboOption ) {
		this.appendOptions([comboOption]);
	}
	
	/**
	 * Appends a series of values to the combo
	 * @param comboComboOption
	 */
	appendOptions( comboComboOption = [] ) {
		this.setValue( this.value.concat( comboComboOption ) );
	}
	
	/**
	 * Remove a combo option
	 * @param comboOption
	 */
	removeOption( comboOption ) {
		
		if( !(comboOption instanceof ComboOption) ) {
			throw new Error('removeOption requires that values of comboOptions be instances of ComboOption');
		}
		
		this.value = this.value.filter( (thisComboOption) => thisComboOption.value === comboOption.value );
	}
	
	/**
	 * Remove a combo option
	 * @param comboOptions
	 */
	removeOptions( comboOptions ) {
		
		if( !Array.isArray(comboOptions) ) {
			throw new Error('removeOptions expect comboOptions to be an array!');
		}
		
		comboOptions.forEach( (thisComboOption) => { this.removeOption(thisComboOption); });
	}
	
	/**
	 * Set Values
	 * @param comboOptions
	 */
	setValue( comboOptions = [] ) {
		
		if( !Array.isArray(comboOptions) ) {
			throw new Error('setValue expect comboValues to be an array!');
		}
		
		comboOptions.forEach((thisComboOption) => {
			if( !(thisComboOption instanceof ComboOption) ) {
				throw new Error('setValue requires that values of comboOptions be instances of ComboOption');
			}
		});
		
		this.value = comboOptions;
	}
	
	clearValue() {
		this.value = [];
	}
	
	getBatchValue() {
		return this.value.map( thisComboValue => thisComboValue.id );
	}
	
}