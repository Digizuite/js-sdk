import {MultiComboValueMetadataItem} from './multiComboValueMetadataItem';
import {ComboOption} from 'model/metadata/comboOption';

export class EditMultiComboValueMetadataItem extends MultiComboValueMetadataItem {
	
	static get TYPE() { return 169; }
	static get VALUE_TYPE() { return 17; }
	
	get TYPE() { return EditMultiComboValueMetadataItem.TYPE; }
	get VALUE_TYPE() { return EditMultiComboValueMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
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
	
	getBatchValue() {
		return this.value.map( thisComboValue => thisComboValue.value );
	}
	
}