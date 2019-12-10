import * as fecha from 'fecha';
import {Model} from '../common/model';
import {getExtension} from '../utilities/helpers/url';

export interface IAssetArgs {
	id?: number;
	name?: string;
	description?: string;
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
	public id: number | undefined;
	public thumbnail: string | undefined;
	public type: number | undefined;
	public name: string | undefined;
	public description: string | undefined;

	public date: Date | undefined;
	public publishedDate: Date | null;
	public lastEditedDate: Date | null;
	public transcodes: ITranscode[]  = [];
	private sourceLocation: null | string;
	// tslint:disable-next-line
	private assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE: number | null;
	private fileExtension: string | null;
	private lastPublishedDate: any | null;

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IAssetArgs) {
		super();

		this.id = args.id;
		this.name = args.name;
		this.description = args.description;
		this.type = args.type;
		this.thumbnail = args.thumbnail;
		this.publishedDate = null;
		this.lastPublishedDate = null;
		this.lastEditedDate = null;
		this.sourceLocation = null;
		this.assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE = null;
		this.fileExtension = null;
	}

	static get DATETIME_FORMAT() {
		return 'YYYY-MM-DDTHH:mm:ss.SSS';
	}

	static get DATETIMETZ_FORMAT() {
		return 'YYYY-MM-DDTHH:mm:ssZZ';
	}

	/**
	 * Populates an asset from with the API values
	 * @param args
	 */
	public setValueFromAPI(args: any) {

		this.id = parseInt(args.itemId, 10);
		this.name = args.name;
		this.description = args.description;
		this.type = parseInt(args.assetType, 10);

		this.thumbnail = '';
		if (args.hasOwnProperty('thumb')) {
			this.thumbnail = args.thumb.indexOf('?mptdid=0') === -1 ? args.thumb : '';
		}
		this.transcodes = args.hasOwnProperty('transcodeFilename') ? args.transcodeFilename : [];

		if (args.firstPublished) {
			this.publishedDate = fecha.parse(args.firstPublished, Asset.DATETIME_FORMAT);
		}
		if (args.lastPublished) {
			this.lastPublishedDate = fecha.parse(args.lastPublished, Asset.DATETIME_FORMAT);
		}
		if (args.edited) {
			this.lastEditedDate = fecha.parse(args.edited, Asset.DATETIMETZ_FORMAT);
		}

		if (args.date) {

			this.date = fecha.parse(args.date, Asset.DATETIME_FORMAT);

			// If the parse failed, try the alternative datetime format
			if (!this.date) {
				this.date = fecha.parse(args.date, Asset.DATETIMETZ_FORMAT);
			}

		}
		this.sourceLocation = '';
		if (args.sourceLocation) {
			this.sourceLocation = args.sourceLocation;
		}
		// for legacy reason we still need this
		this.assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE = parseInt(args.assetId, 10);
	}

	public setValueFromOtherAsset(otherAsset: Asset) {
		this.type = otherAsset.type;
	}

	public IAgreeWithKittensBeingDeadSoThatICanUseAssetId() {
		return this.assetId__DO_NOT_USE_THIS_OR_KITTENS_WILL_DIE;
	}

	/**
	 *
	 * @param mediaFormatId
	 * @returns {*|T}
	 */
	public getTranscodeForMediaFormat(mediaFormatId: number): ITranscode | undefined {
		return this.transcodes.find((transcode: ITranscode) =>
			parseInt(transcode.mediaFormatId, 10) === mediaFormatId);
	}

	/**
	 * Returns the extension of the source location of the asset
	 * @returns {string}
	 */
	public getFileExtension() {

		if (!this.fileExtension) {
			this.fileExtension = getExtension(this.sourceLocation!).toLowerCase();
		}

		return this.fileExtension;
	}
}
