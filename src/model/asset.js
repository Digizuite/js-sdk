export class Asset {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
	
		this.id = parseInt(args.itemId, 10);
		this.name = args.name;
		this.type = parseInt(args.assetType, 10);
		this.thumbnail =  args.thumb.indexOf('?mptdid=0') === -1 ? args.thumb : '';
		
		this._transcodes = args.transcodeFilename;
	
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