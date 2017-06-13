import {Endpoint} from 'common/endpoint';
import {UploadTicket} from 'model/ticket/uploadTicket';
import {Asset} from 'model/asset';
import {DigiUploader} from 'utilities/digizuite/digiUploader';
import {AssetsBasicInformation} from 'request/searchService/assetsBasicInformation';
import {AssetsInformation} from 'request/searchService/assetsInformation';

export class Upload extends Endpoint {
	
	static get ASSET_EDITABLE_TIMEOUT() {
		return 10000;
	} // 10 seconds
	static get ASSET_PUBLISHED_TIMEOUT() {
		return 60000;
	} // 60 seconds
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {string} args.computerName
	 */
	constructor(args = {}) {
		super(args);
		this._digiUpload = new DigiUploader(args);
		
		this._assetEditableQueue = [];
		this._assetPublishedQueue = [];
	}
	
	/**
	 * Returns a promise that resolves to an array of upload tickets
	 * @param args
	 * @param {File[]} args.files
	 * @returns {Promise.<UploadTicket[]>}
	 */
	requestUploadTickets(args = {}) {
		
		if (!Array.isArray(args.files)) {
			throw new Error('Upload expect array of files as parameter');
		}
		
		return Promise.all(
			args.files.map(thisFile => this._digiUpload.getUploadIds({file: thisFile}))
		).then((results) => {
			return results.map((thisResult, index) => {
				return new UploadTicket({
					uploadId: thisResult.uploadId,
					itemId  : thisResult.itemId,
					file    : args.files[index]
				});
			});
		});
		
	}
	
	/**
	 * Upload assets from upload tickets
	 * @param args
	 * @param {UploadTicket[]} args.tickets
	 * @returns {Promise.<Asset[]>}
	 */
	uploadAssetsByTicket(args = {}) {
		
		if (!Array.isArray(args.tickets)) {
			throw new Error('Upload expect array of tickets as parameter');
		}
		
		return Promise.all(
			args.tickets.map(thisTicket => {
				return this._digiUpload.uploadFile(thisTicket)
					.then(() => this._digiUpload.finishUpload(thisTicket))
					.then(() => {
						return new Asset({
							id  : thisTicket.itemId,
							name: thisTicket.file.name.substr(0, thisTicket.file.name.lastIndexOf('.'))
						});
					});
			})
		);
	}
	
	/**
	 * Returns a promise that resolves when the asset becomes editable
	 * @param asset
	 * @returns {Promise}
	 */
	awaitAssetEditable(asset) {
		
		if (!(asset instanceof Asset)) {
			throw new Error('awaitAssetEditable expects an asset as parameter');
		}
		
		return new Promise((resolve) => {
			this._addToAssetEditableQueue({asset, resolve});
		});
	}
	
	/**
	 * Returns a promise that resolves when the asset is published
	 * @param asset
	 * @returns {Promise}
	 */
	awaitAssetPublished(asset) {
		
		if (!(asset instanceof Asset)) {
			throw new Error('awaitAssetPublished expects an asset as parameter');
		}
		
		return new Promise((resolve) => {
			this._addToAssetPublishedQueue({asset, resolve});
		});
	}
	
	/**
	 * Creates a queue for published assets
	 * @param args
	 * @private
	 */
	_addToAssetPublishedQueue(args = {}) {
		
		this._assetPublishedQueue.push(args);
		
		// If there is more than 1 item in the queue, it will be picked up auto-magically
		if (this._assetPublishedQueue.length === 1) {
			this._checkAssetsPublished();
		}
		
	}
	
	/**
	 * Creates a queue for editable assets
	 * @param args
	 * @private
	 */
	_addToAssetEditableQueue(args = {}) {
		
		this._assetEditableQueue.push(args);
		
		// If there is more than 1 item in the queue, it will be picked up auto-magically
		if (this._assetEditableQueue.length === 1) {
			this._checkAssetsEditable();
		}
		
	}
	
	/**
	 * Check if a list of assets is editable
	 * @private
	 */
	_checkAssetsPublished() {
		
		if (!this._assetPublishedRequest) {
			this._assetPublishedRequest = new AssetsInformation({
				apiUrl: this.apiUrl
			});
		}
		
		this._assetPublishedRequest.execute({
			assets: this._assetPublishedQueue.map(thisQueueItem => thisQueueItem.asset)
		}).then((assets) => {
			
			// Resolve the promise for the found assets
			assets
				.filter((thisAsset) => (thisAsset.publishedDate instanceof Date))
				.forEach((thisAsset) => {
					
					const queueIndex = this._assetPublishedQueue.findIndex(
						(thisQueueItem) => thisQueueItem.asset.id === thisAsset.id
					);
					const queueItem  = this._assetPublishedQueue[queueIndex];
					
					// remove it from the queue
					this._assetPublishedQueue.splice(queueIndex, 1);
					
					queueItem.resolve(thisAsset);
				});
			
			if (this._assetPublishedQueue.length > 0) {
				setTimeout(
					this._checkAssetsPublished.bind(this),
					Upload.ASSET_PUBLISHED_TIMEOUT
				);
			}
			
		});
		
	}
	
	/**
	 * Check if a list of assets is editable
	 * @private
	 */
	_checkAssetsEditable() {
		
		if (!this._assetBasicInformationRequest) {
			this._assetBasicInformationRequest = new AssetsBasicInformation({
				apiUrl: this.apiUrl
			});
		}
		
		this._assetBasicInformationRequest.execute({
			assets: this._assetEditableQueue.map(thisQueueItem => thisQueueItem.asset)
		}).then((basicAssets) => {
			
			// Resolve the promise for the found assets
			basicAssets.forEach((thisBasicAsset) => {
				
				const queueIndex = this._assetEditableQueue.findIndex(
					(thisQueueItem) => thisQueueItem.asset.id === thisBasicAsset.id
				);
				const queueItem  = this._assetEditableQueue[queueIndex];
				
				// remove it from the queue
				this._assetEditableQueue.splice(queueIndex, 1);
				
				queueItem.asset.type = thisBasicAsset.type;
				queueItem.resolve(queueItem.asset);
			});
			
			if (this._assetEditableQueue.length > 0) {
				setTimeout(
					this._checkAssetsEditable.bind(this),
					Upload.ASSET_EDITABLE_TIMEOUT
				);
			}
			
		});
		
	}
	
}