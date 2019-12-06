import {Endpoint, IEndpointArgs} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {ASSET_TYPE, Constants} from '../const';
import {Asset} from "../model/asset";
import {DownloadQualities} from '../request/memberService/downloadQualities';

export interface IDownloadArgs extends IEndpointArgs {
	memberId: number;
	lowResMediaFormatIds: number[];
	highResMediaFormatIds: number[];
	mediaUrl: string;
}

export class Download extends Endpoint {
	private memberId: number;
	private lowResMediaFormatIds: number[];
	private highResMediaFormatIds: number[];
	private mediaUrl: string;
	private cache: { qualities: Promise<any>|null };

	/**
	 * C-tor
	 * @param {Object} args
	 */
	constructor(args: IDownloadArgs) {
		super(args);

		this.memberId = args.memberId;
		this.lowResMediaFormatIds = args.lowResMediaFormatIds;
		this.highResMediaFormatIds = args.highResMediaFormatIds;
		this.mediaUrl = args.mediaUrl;

		this.cache = {
			qualities: null,
		};
	}

	/**
	 * Returns a promise that resolves to the download URL of the asset
	 * @param {Object} args
	 * @param {Asset} args.asset
	 * @param {Number} args.quality
	 * @returns {Promise.<string>}
	 */
	public getDownloadURL(args: { asset: Asset, quality: number }): Promise<string> {

		if (!args.asset) {
			throw new Error('getDownloadURL expected an asset as parameter!');
		}

		return this._getAllDownloadQualities().then((qualities) => {

			// get only the qualities for the current asset type
			const assetQualities = qualities.find((thisQualityGroup: any) =>
				thisQualityGroup.assetType === args.asset.type);
			const quality = args.quality || Constants.DOWNLOAD_QUALITY.ORIGINAL;
			let mediaFormatId = -1;

			if (quality !== Constants.DOWNLOAD_QUALITY.ORIGINAL) {

				if (!assetQualities) {
					throw new Error('Requested quality not found for the asset!');
				}

				const searchArray = quality === Constants.DOWNLOAD_QUALITY.HIGH_RES ?
					this.highResMediaFormatIds : this.lowResMediaFormatIds;

				// Make voodoo and intersect these array to find the format id
				searchArray.forEach((thisMediaFormatId) => {
					const format = assetQualities.formats.find((thisFormat: any) =>
						thisFormat.mediaformatId === thisMediaFormatId);
					if (format) {
						mediaFormatId = thisMediaFormatId;
					}
				});

			}

			return this._getDownloadURLForFormat({
				asset: args.asset,
				download: true,
				mediaFormatId,
			});
		});

	}

	/**
	 * Returns a URL for a required quality
	 * @param args
	 */
	public getUrlForQuality(args: { asset: Asset, quality: number }) {

		if (!args.asset) {
			throw new Error('getUrlForQuality expected an asset as parameter!');
		}

		if (!args.quality) {
			throw new Error('getUrlForQuality expected a quality as parameter!');
		}

		if (args.quality !== Constants.DOWNLOAD_QUALITY.HIGH_RES
			&& args.quality !== Constants.DOWNLOAD_QUALITY.LOW_RES) {
			throw new Error('getUrlForQuality expected a valid quality as parameter!');

		}

		let mediaFormatId = -1;

		const searchArray = args.quality === Constants.DOWNLOAD_QUALITY.HIGH_RES ?
			this.highResMediaFormatIds : this.lowResMediaFormatIds;

		// Make voodoo and intersect these array to find the format id
		searchArray.forEach((thisMediaFormatId) => {
			const format = args.asset.transcodes.find((thisFormat) =>
				parseInt(thisFormat.mediaFormatId, 10) === thisMediaFormatId);
			if (format) {
				mediaFormatId = thisMediaFormatId;
			}
		});

		if (mediaFormatId === -1) {
			throw new Error('Could not found requested quality');
		}

		return Promise.resolve(
			this._getDownloadURLForFormat({
				asset: args.asset,
				download: false,
				mediaFormatId,
			}),
		);

	}

	/**
	 * Returns a promise that resolves to the download URL of the asset
	 * @param {Object} args
	 * @param {Asset} args.asset
	 * @param {Number} args.mediaFormatId
	 * @returns {String}
	 */
	public _getDownloadURLForFormat(args: { asset: Asset, mediaFormatId: number, download?: boolean }) {

		const transcode = args.asset.getTranscodeForMediaFormat(args.mediaFormatId);
		const forceDownload = args.download ? 'true' : 'false';

		// Build download URL as defined by House og Co.
		let downloadUrl = `${this.mediaUrl}dmm3bwsv3/AssetStream.aspx?assetid=i${args.asset.id}` +
			`&download=${forceDownload}&accesskey=${this.accessKey}&cachebust=${Date.now()}`;

		// since source copies are not stored as a different transcode
		// we don't need to set a format ID or destination ID
		if (args.mediaFormatId === -1) {
			downloadUrl += '&AssetOutputIdent=Download';
		} else {
			downloadUrl += `&downloadName=&mediaformatid=${transcode!.mediaFormatId}` +
				`&destinationid=${transcode!.mediaTranscodeDestinationId}`;
		}

		return downloadUrl;
	}

	/**
	 *
	 * @param args
	 * @returns {Promise}
	 */
	public getAllDownloadURL(args: { asset: Asset }): Promise<Array<{ quality: string, url: string }>> {

		if (!args.asset) {
			throw new Error('getDownloadURL expected an asset as parameter!');
		}

		return this._getAllDownloadQualities().then((qualities) => {

			const result: Array<{ quality: string, url: string }> = [];

			const assetQualities = qualities.find((thisQualityGroup: any) =>
				thisQualityGroup.assetType === args.asset.type);

			if (assetQualities) {
				assetQualities.formats.forEach((thisFormat: any) => {
					const thisTranscode = args.asset.getTranscodeForMediaFormat(thisFormat.mediaformatId);
					if (thisTranscode) {
						result.push({
							quality: thisFormat.label,
							url: this._getDownloadURLForFormat({
								asset: args.asset,
								mediaFormatId: thisFormat.mediaformatId,
							}),
						});
					}
				});
			}

			const allAssetTypeQualities = qualities.find((thisQualityGroup: any) => thisQualityGroup.assetType === 0);
			if (allAssetTypeQualities) {
				result.push({
					quality: 'Original',
					url: this._getDownloadURLForFormat({asset: args.asset, mediaFormatId: -1}),
				});
			}

			return result;
		});
	}

	/**
	 *  Returns a list of download qualities
	 * @returns {Object}
	 * @private
	 */
	public _getAllDownloadQualities() {

		if (!this.cache.qualities) {
			this.cache.qualities = new Promise((resolve) => {

				const downloadQualitiesRequest = new DownloadQualities({
					apiUrl: this.apiUrl,
					accessKey: this.accessKey,
				});

				downloadQualitiesRequest.execute().then((downloadQualities) => {
					resolve(this._hackishlyAddDownloadQualitiesForAdobeFormats(downloadQualities));
				});

			});
		}

		return this.cache.qualities;
	}

	/**
	 * HACK: Since the GetDownloadQualities does not support assets type
	 * like InDesign, Photoshop and Illustator, we will manually clone the ones from
	 * image to them
	 * @param downloadQualities
	 * @private
	 */
	private _hackishlyAddDownloadQualitiesForAdobeFormats(downloadQualities: any[]) {

		const adobeTypes = [ ASSET_TYPE.INDESIGN,  ASSET_TYPE.PHOTOSHOP, ASSET_TYPE.ILLUSTRATOR, ASSET_TYPE.VIDEO ];

		// Take the existing image formats
		const imageFormats = downloadQualities.find((thisQualityGroup: any) =>
			thisQualityGroup.assetType === ASSET_TYPE.IMAGE);

		// Determine existing asset types
		const existingAssetType: {[name: number]: boolean} = {};
		downloadQualities.forEach((thisQuality: any) => {
			existingAssetType[ (thisQuality.assetType as number) ] = true;
		});

		// Append the types, if they don't exist already
		adobeTypes
			.filter(thisAssetType => !existingAssetType[thisAssetType])
			.forEach(thisAssetType => {
				downloadQualities.push({
					assetType: thisAssetType,
					formats: imageFormats.formats,
				});
			});

		return downloadQualities;
	}

}

// Attach endpoint
const name = 'download';
const getter = function (instance: ConnectorType) {
	return new Download({
		accessKey: instance.state.user.accessKey,
		apiUrl: instance.state.constants.baseApiUrl,
		highResMediaFormatIds: instance.state.config.HighResMediaFormatIds,
		lowResMediaFormatIds: instance.state.config.LowResMediaFormatIds,
		mediaUrl: instance.state.config.MediaUrl,
		memberId: instance.state.user.memberId,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		download: Download;
	}
}
