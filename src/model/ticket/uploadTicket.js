export class UploadTicket {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		this.itemId = args.itemId;
		this.uploadId = args.uploadId;
		this.file = args.file;
		this.onProgress = function() {};
	}
	
}