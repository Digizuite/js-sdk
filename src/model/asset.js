import fecha from 'fecha';
import {Model} from '../common/model';

export class Asset extends Model {
	
	static get DATETIME_FORMAT() {
		return 'YYYY-MM-DDTHH:mm:ss.SSS';
	}
	
	static get DATETIMETZ_FORMAT() {
		return 'YYYY-MM-DDTHH:mm:ssZZ';
	}
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		super(args);
		
		this.id = args.id;
		this.name = args.name;
		this.type = args.type;
		this.thumbnail =  args.thumbnail;
		this.publishedDate = null;
		this.lastEditedDate = null;
		this.__assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE = null;
		
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
		
		if( args.edited ) {
			this.lastEditedDate = fecha.parse(args.edited, Asset.DATETIMETZ_FORMAT);
		}

		if( args.date ) {
			this.date = fecha.parse(args.date, Asset.DATETIME_FORMAT);
		}
		
		// for legacy reason we still need this
		this.__assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE = parseInt(args.assetId, 10);
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