import {MetadataGroup} from './metadataGroup';

export class LanguageMetadataGroup extends MetadataGroup {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		super(args);
		
		this.languageId = args.languageId;
	}
	
}