export class AssetVersion {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		
		this.id                                             = args.id;
		this.type                                           = args.type;
		this.versionId                                      = args.versionId;
		this.thumbnail                                      = args.thumbnail;
		this.isCurrentVersion                               = !!args.isCurrentVersion;
		this.__assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE = null;
	}
	
	/**
	 * Create an instance from an API response
	 * @param args
	 * @returns {AssetVersion}
	 */
	static createFromAPIResponse(args = {}) {
		const asset = new AssetVersion();
		asset.setValueFromAPI(args);
		return asset;
	}
	
	/**
	 * Populates an asset from with the API values
	 * @param args
	 */
	setValueFromAPI(args = {}) {
		this.id   = parseInt(args.itemId, 10);
		this.type = parseInt(args.assetType, 10);
		
		const versionId = parseInt(args.assetVersionId, 10);
		this.versionId  = !Number.isNaN(versionId) ? versionId : 0;
		
		this.thumbnail = '';
		if (args.hasOwnProperty('thumb')) {
			this.thumbnail = args.thumb.indexOf('?mptdid=0') === -1 ? args.thumb : '';
		}
		
		// for legacy reason we still need this
		this.__assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE = parseInt(args.assetId, 10);
	}
	
}