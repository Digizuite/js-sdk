import fecha from 'fecha';

export class Asset {
	
	static get DATETIME_FORMAT() {
		return 'YYYY-MM-DDTHH:mm:ss.SSS';
	}
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		this.id = args.id;
		this.name = args.name;
		this.type = args.type;
		this.thumbnail =  args.thumbnail;
		this.publishedDate = null;
		
	}
	
	/**
	 * Create an instance from an API response
	 * @param args
	 * @returns {Asset}
	 */
	static createFromAPIResponse( args = {} ) {
		const asset = new Asset();
		asset.setValueFromAPI(args);
		return asset;
	}
	
	/**
	 * Populates an asset from with the API values
	 * @param args
	 */
	setValueFromAPI( args = {} ) {
		this.id = parseInt(args.itemId, 10);
		this.name = args.name;
		this.type = parseInt(args.assetType, 10);
		
		this.thumbnail = '';
		if( args.hasOwnProperty('thumb') ) {
			this.thumbnail = args.thumb.indexOf('?mptdid=0') === -1 ? args.thumb : '';
		}
		
		this._transcodes = args.hasOwnProperty('transcodeFilename') ? args.transcodeFilename : [];
		
		if( args.firstPublished ) {
			this.publishedDate = fecha.parse(args.firstPublished, Asset.DATETIME_FORMAT);
		}
	}
	
	/**
	 *
	 * @param mediaFormatId
	 * @returns {*|T}
	 */
	getTranscodeForMediaFormat( mediaFormatId ) {
		return this._transcodes.find( (transcode)=> parseInt(transcode.mediaFormatId,10) === mediaFormatId );
	}
	
}