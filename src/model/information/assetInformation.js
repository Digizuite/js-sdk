export class AssetInformation {
	
	constructor( args = {} ) {
		
		this.assetId = args.assetId ? parseInt(args.assetId, 10) : null;
		this.informationItems = args.informationItems || [];
		
	}
	
}