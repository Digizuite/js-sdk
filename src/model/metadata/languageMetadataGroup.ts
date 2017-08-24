import {IMetadataGroupArgs, MetadataGroup} from './metadataGroup';

export interface ILanguageMetadataGroupArgs extends IMetadataGroupArgs {
    languageId: number;
}

export class LanguageMetadataGroup extends MetadataGroup {
    private languageId: number;
	
	/**
	 * C-tor
	 * @param args
	 */
    constructor(args: ILanguageMetadataGroupArgs) {
		super(args);
		
		this.languageId = args.languageId;
	}
	
}