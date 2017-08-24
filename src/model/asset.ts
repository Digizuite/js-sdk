import * as fecha from 'fecha';
import {Model} from '../common/model';
import {getExtension} from 'utilities/helpers/url';

export interface IAssetArgs {
    id?: number;
    name?: string;
    type?: number;
    thumbnail?: string;
}

export interface ITranscode {
    mediaFormatId: string;
    mediaTranscodeDestinationId: string;
}

export function CreateAssetFromApiResponse(thisAsset: any) {
    const asset = new Asset(thisAsset);
    asset.setValueFromAPI(thisAsset);
    return asset;
}

export class Asset extends Model {
    id: number | undefined;
    thumbnail: string | undefined;
    type: number | undefined;
    name: string | undefined;

    date: Date;
    publishedDate: Date | null;
    lastEditedDate: Date | null;
    private _transcodes: ITranscode[];
    private __assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE: number | null;

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
    constructor(args: IAssetArgs) {
        super();

		this.id = args.id;
		this.name = args.name;
		this.type = args.type;
		this.thumbnail =  args.thumbnail;
		this.publishedDate = null;
		this.lastEditedDate = null;
		this._sourceLocation = null;
		this.__assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE = null;
		this._fileExtension = null;
	}
	
	/**
	 * Populates an asset from with the API values
	 * @param args
	 */
    setValueFromAPI(args: any) {

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
		this._sourceLocation = '';
		if( args.sourceLocation ){
			this._sourceLocation = args.sourceLocation;
		}
		// for legacy reason we still need this
		this.__assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE = parseInt(args.assetId, 10);
	}

    /**
	 *
	 * @param mediaFormatId
	 * @returns {*|T}
	 */
	getTranscodeForMediaFormat( mediaFormatId : number): ITranscode | undefined {
		return this._transcodes.find( (transcode: ITranscode)=> parseInt(transcode.mediaFormatId,10) === mediaFormatId );
	}
	/**
	 * Returns the extension of the source location of the asset
	 * @returns {string}
	 */
	getFileExtension() {

		if(!this._fileExtension) {
			this._fileExtension = getExtension(this._sourceLocation).toLowerCase();
		}

		return this._fileExtension;
	}
}