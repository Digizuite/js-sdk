import {IMetadataItemArgs, ISetValueFromApiArgs, MetadataItem} from './metadataItem';
import {ComboOption} from './comboOption';

export class ComboValueMetadataItem extends MetadataItem<ComboOption | null> {

	static get TYPE() { return 68; }
	static get VALUE_TYPE() { return 3; }
	
	get TYPE() { return ComboValueMetadataItem.TYPE; }
	get VALUE_TYPE() { return ComboValueMetadataItem.VALUE_TYPE; }

    constructor(args: IMetadataItemArgs<ComboOption>) {
		super(args);
	}
	
	/**
	 * Sets value from API
	 * @param args
	 */
    setValueFromAPI(args: ISetValueFromApiArgs) {
		
		super.setValueFromAPI(args);
		
		this.value = Array.isArray(args.item_metafield_valueid) ?
			ComboOption.createFromAPIResponse(args.item_metafield_valueid[0]) :
			null;
		
	}

    clearValue(): void {
        this.value = null;
    }

    /**
	 * Sets a value
	 * @param {ComboOption} comboOption
	 */
    setValue(comboOption: ComboOption) {
		
		if( !(comboOption instanceof ComboOption) ) {
			throw new Error('setValue expects comboOption to be instance of ComboOption.');
		}
		
		super.setValue(comboOption);
	}

    getUpdateValue(): any {
		return this.value ? this.value.id : null;
	}
	
}