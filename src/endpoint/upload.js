import {Endpoint} from 'common/endpoint';
import {UploadTicket} from 'model/ticket/uploadTicket';
import {ReplaceTicket} from 'model/ticket/replaceTicket';
import {Asset} from 'model/asset';
import {CreateUpload} from 'request/uploadService/createUpload';
import {ItemIdUpload} from 'request/uploadService/itemIdUpload';
import {SetFileName} from 'request/uploadService/setFileName';
import {SetTransferMode} from 'request/uploadService/setTransferMode';
import {SetAssetId} from 'request/uploadService/setAssetId';
import {SetMetaSource} from 'request/uploadService/setMetaSource';
import {SetArchiveReplace} from 'request/uploadService/setArchiveReplace';
import {SubmitUpload} from 'request/uploadService/submitUpload';
import {UploadFileChunk} from 'request/uploadService/uploadFileChunk';
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
		this.computerName = args.computerName;
		
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
			args.files.map(thisFile => this._getUploadId(thisFile))
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
	 * Returns a promise that resolved to a replace ticket
	 * @param args
	 * @returns {Promise.<ReplaceTicket>}
	 */
	requestReplaceTicket(args = {}) {
		
		if( !(args.asset instanceof Asset) ) {
			throw new Error('Replace expect an asset as parameter');
		}
		
		return this._getUploadId(args.file)
			.then((result) => {
				return new ReplaceTicket({
					uploadId: result.uploadId,
					itemId  : result.itemId,
					file    : args.file,
					asset   : args.asset
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
				return this._uploadFile(thisTicket)
					.then(() => this._finishUpload(thisTicket))
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
	 * Upload assets from upload tickets
	 * @param args
	 * @param {ReplaceTicket} args.ticket
	 * @returns {Promise.<>}
	 */
	replaceAssetByTicket( args = {} ) {
		
		if ( !(args.ticket instanceof ReplaceTicket)) {
			throw new Error('Replace expect a replace ticket as parameter');
		}
		
		return this._uploadFile(args.ticket)
			.then(() => this._finishUpload(args.ticket))
			.then(() => { return {}; });
		
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
	
	/**
	 * Upload a file
	 * @param {UploadTicket} ticket
	 * @private
	 */
	_uploadFile(ticket) {
		
		if (!(ticket instanceof UploadTicket)) {
			throw new Error('Upload expect an upload ticket as parameter');
		}
		
		this.fileChunkUploader = new UploadFileChunk({
			apiUrl: this.apiUrl
		});
		
		return this.fileChunkUploader.uploadFile(ticket);
		
	}
	
	/**
	 * Finishes an upload
	 * @param {UploadTicket|ReplaceTicket} ticket
	 * @private
	 */
	_finishUpload(ticket) {
		
		const setFileNameRequest = new SetFileName({
			apiUrl: this.apiUrl
		});
		
		const setTransferModeRequest = new SetTransferMode({
			apiUrl: this.apiUrl
		});
		
		const submitUploadRequest = new SubmitUpload({
			apiUrl: this.apiUrl
		});
		
		const requests = [
			setFileNameRequest.execute({uploadId: ticket.uploadId, file: ticket.file}),
			setTransferModeRequest.execute({uploadId: ticket.uploadId})
		];
		
		// When replacing we need 3!! more requests.
		if( ticket instanceof ReplaceTicket) {
			
			const setAssetIdRequest = new SetAssetId({
				apiUrl: this.apiUrl
			});
			
			
			const setMetaSourceRequest = new SetMetaSource({
				apiUrl: this.apiUrl
			});
			
			
			const setArchiveReplaceRequest = new SetArchiveReplace({
				apiUrl: this.apiUrl
			});
			
			requests.push(
				setAssetIdRequest.execute({ uploadId: ticket.uploadId, asset: ticket.asset })
			);
			requests.push(
				setMetaSourceRequest.execute({ uploadId: ticket.uploadId })
			);
			requests.push(
				setArchiveReplaceRequest.execute({ uploadId: ticket.uploadId })
			);
		}
		
		return Promise.all(requests).then(() => {
			return submitUploadRequest.execute({uploadId: ticket.uploadId});
		});
	}
	
	/**
	 * Get upload ID
	 * @param file
	 * @private
	 */
	_getUploadId(file) {
		
		if (!(file instanceof File)) {
			throw new Error('_getUploadID expect parameter file to be an instance of File');
		}
		
		const createUploadRequest = new CreateUpload({
			apiUrl: this.apiUrl
		});
		
		const itemIdUploadRequest = new ItemIdUpload({
			apiUrl: this.apiUrl
		});
		
		let uploadId;
		
		// Create an upload request
		return createUploadRequest.execute({
			computerName: this.computerName,
			file
		}).then(result => {
			
			uploadId = result.uploadId;
			
			return itemIdUploadRequest.execute({uploadId});
			
		}).then(({itemId}) => {
			return {itemId, uploadId};
		});
	}
	
}