import {Endpoint} from 'common/endpoint';
import {DownloadQualities} from 'request/memberService/downloadQualities';
import {Constants} from 'const';

export class Download extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 */
	constructor(args = {}) {
		super(args);
		
		this.memberId              = args.memberId;
		this.accessKey             = args.accessKey;
		this.lowResMediaFormatIds  = args.lowResMediaFormatIds;
		this.highResMediaFormatIds = args.highResMediaFormatIds;
		this.mediaUrl              = args.mediaUrl;
		
		this.cache = {
			qualities: null
		};
	}
	
	/**
	 * Returns a promise that resolves to the download URL of the asset
	 * @param {Object} args
	 * @param {Asset} args.asset
	 * @param {Number} args.quality
	 * @returns {Promise.<string>}
	 */
	getDownloadURL(args = {}) {
		
		if (!args.asset) {
			throw new Error('getDownloadURL expected an asset as parameter!');
		}
		
		return this._getAllDownloadQualities().then((qualities) => {
			
			// get only the qualities for the current asset type
			const assetQualities = qualities.find((thisQualityGroup)=> thisQualityGroup.assetType === args.asset.type);
			const quality = args.quality || Constants.DOWNLOAD_QUALITY.ORIGINAL;
			let mediaFormatId = -1;
			
			if( quality !== Constants.DOWNLOAD_QUALITY.ORIGINAL ) {
				
				if(!assetQualities) {
					throw new Error('Requested quality not found for the asset!');
				}
				
				let searchArray = quality === Constants.DOWNLOAD_QUALITY.HIGH_RES ?
					this.highResMediaFormatIds : this.lowResMediaFormatIds;
				
				// Make voodoo and intersect these array to find the format id
				searchArray.forEach( (thisMediaFormatId)=> {
					const format = assetQualities.formats.find((thisFormat) => thisFormat.mediaformatId === thisMediaFormatId);
					if(format) {
						mediaFormatId = thisMediaFormatId;
					}
				});

			}
			
			return this._getDownloadURLForFormat({asset: args.asset, mediaFormatId});
		});
		
	}
	
	/**
	 * Returns a promise that resolves to the download URL of the asset
	 * @param {Object} args
	 * @param {Asset} args.asset
	 * @param {Number} args.mediaFormatId
	 * @returns {String}
	 */
	_getDownloadURLForFormat(args = {}) {
		
		const transcode = args.asset.getTranscodeForMediaFormat(args.mediaFormatId);
		
		// Build download URL as defined by House og Co.
		let downloadUrl = `${this.mediaUrl}dmm3bwsv3/AssetStream.aspx?assetid=i${args.asset.id}&download=true&accesskey=${this.accessKey}&cachebust=${Date.now()}`;

		// since source copies are not stored as a different transcode
		// we don't need to set a format ID or destination ID
		if (args.mediaFormatId === -1) {
			downloadUrl += '&AssetOutputIdent=Download';
		} else {
			downloadUrl += `&downloadName=&mediaformatid=${transcode.mediaFormatId}&destinationid=${transcode.mediaTranscodeDestinationId}`;
		}

		return downloadUrl;
	}
	
	/**
	 *
	 * @param args
	 * @returns {Promise}
	 */
	getAllDownloadURL( args = {} ) {
		
		if (!args.asset) {
			throw new Error('getDownloadURL expected an asset as parameter!');
		}
		
		return this._getAllDownloadQualities().then((qualities) => {
			
			let result = [];
			
			const assetQualities = qualities.find((thisQualityGroup)=> thisQualityGroup.assetType === args.asset.type);
			
			assetQualities.formats.forEach((thisFormat) => {
				const thisTranscode = args.asset.getTranscodeForMediaFormat( thisFormat.mediaformatId );
				if( thisTranscode ) {
					result.push({
						quality : thisFormat.label,
						url : this._getDownloadURLForFormat({ asset : args.asset, mediaFormatId : thisFormat.mediaformatId })
					});
				}
			});
			
			const allAssetTypeQualities = qualities.find((thisQualityGroup)=> thisQualityGroup.assetType === 0);
			if( allAssetTypeQualities ) {
				result.push({
					quality : 'Original',
					url : this._getDownloadURLForFormat({ asset : args.asset, mediaFormatId : -1 })
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
	_getAllDownloadQualities() {
		
		const downloadQualitiesRequest = new DownloadQualities({
			apiUrl: this.apiUrl
		});
		
		if (this.cache.qualities) {
			return Promise.resolve(this.cache.qualities);
		}
		
		return downloadQualitiesRequest.execute().then((downloadQualities)=>{
			this.cache.qualities = downloadQualities;
			return downloadQualities;
		});
		
	}
	
}