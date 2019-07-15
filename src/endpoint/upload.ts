import {Endpoint, IEndpointArgs} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {GUID} from '../const';
import {Asset} from '../model/asset';
import {CloudFile} from '../model/cloudFile';
import {BitMetadataItem} from '../model/metadata/bitMetadataItem';
import {UploadTicket} from '../model/ticket/uploadTicket';
import {Assets} from '../request/searchService/assets';
import {AssetsBasicInformation} from '../request/searchService/assetsBasicInformation';
import {PublishStatus} from '../request/searchService/publishStatus';
import {createDigiUploader} from '../utilities/digiUploader/digiUploaderProvider';
import {DigiUploadFile, IDigiUploader} from '../utilities/digiUploader/iDigiUploader';

export interface IUploadEndpointArgs extends IEndpointArgs {
	computerName: string;
	apiVersion: string;
	instance: ConnectorType;
}

export class Upload extends Endpoint {
	private instance: ConnectorType;
	private digiUpload: IDigiUploader;
	private assetEditableQueue: any[];
	private assetPublishedQueue: any[];
	private assetPublishedRequest: PublishStatus;
	private assetBasicInformationRequest?: AssetsBasicInformation;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {string} args.computerName
	 */
	constructor(args: IUploadEndpointArgs) {
		super(args);

		this.instance = args.instance; // i feel sick only reading this

		this.digiUpload = createDigiUploader({
			computerName: args.computerName,
			apiUrl: args.apiUrl,
			accessKey: args.accessKey || '',
			apiVersion: args.apiVersion,
		});

		this.assetEditableQueue = [];
		this.assetPublishedQueue = [];
	}

	static get ASSET_EDITABLE_TIMEOUT() {
		return 10000;
	} // 10 seconds

	static get ASSET_PUBLISHED_TIMEOUT() {
		return 60000;
	} // 60 seconds

	/**
	 * Returns a promise that resolves to an array of upload tickets
	 * @param args
	 * @param {File|CloudFile[]} args.files
	 * @returns {Promise.<UploadTicket[]>}
	 */
	public requestUploadTickets(args: { files: DigiUploadFile[] }): Promise<UploadTicket[]> {

		if (!Array.isArray(args.files)) {
			throw new Error('Upload expect array of files as parameter');
		}

		return Promise.all(
			args.files.map((thisFile: File | CloudFile) => this.digiUpload.getUploadIds({file: thisFile})),
		).then((results) => {
			return results.map((thisResult, index) => {
				return new UploadTicket({
					file: args.files[index],
					itemId: thisResult.itemId,
					uploadId: thisResult.uploadId,
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
	public uploadAssetsByTicket(args: { tickets: UploadTicket[] }) {

		if (!Array.isArray(args.tickets)) {
			throw new Error('Upload expect array of tickets as parameter');
		}

		return Promise.all(
			args.tickets.map((thisTicket) => this._uploadAssetByTicket(thisTicket)),
		);
	}

	/**
	 * Uploads an asset from a ticket
	 * @param {UploadTicket} ticket
	 * @returns {Promise.<Asset[]>}
	 */
	public _uploadAssetByTicket(ticket: UploadTicket) {
		// CloudFile does not need to be transferred/uploaded to the server.
		// DAM Center will download it.
		const transferFilePromise: Promise<void> = ticket.file instanceof CloudFile ?
			Promise.resolve() : this.digiUpload.uploadFile(ticket);

		return transferFilePromise
			.then(() => this._markPublishingInProgress(ticket))
			.then(() => this.digiUpload.finishUpload(ticket))
			.then(() => {
				return new Asset({
					id: ticket.itemId,
					name: ticket.file!.name.substr(0, ticket.file!.name.lastIndexOf('.')),
				});
			});
	}

	/**
	 * Marks an asset as being in publish
	 * @param ticket
	 */
	public _markPublishingInProgress(ticket: UploadTicket) {

		const publishInProgressItem = new BitMetadataItem({
			guid: GUID.PUBLISH_IN_PROGRESS,
			value: true,
		});

		return this.instance.metadata.updateMetadataItems({
			assets: [new Asset({id: ticket.itemId})],
			metadataItems: [publishInProgressItem],
		});

	}

	/**
	 * Returns a promise that resolves when the asset becomes editable
	 * @param asset
	 * @returns {Promise}
	 */
	public awaitAssetEditable(asset: Asset) {

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
	public awaitAssetPublished(asset: Asset) {

		if (!(asset instanceof Asset)) {
			throw new Error('awaitAssetPublished expects an asset as parameter');
		}

		return new Promise((resolve) => {
			this._addToAssetPublishedQueue({
				asset,
				resolve,
			});
		});
	}

	/**
	 * Creates a queue for published assets
	 * @param args
	 */
	private _addToAssetPublishedQueue(args = {}) {

		this.assetPublishedQueue.push(args);

		// If there is more than 1 item in the queue, it will be picked up auto-magically
		if (this.assetPublishedQueue.length === 1) {
			this._checkAssetsPublished();
		}

	}

	/**
	 * Creates a queue for editable assets
	 * @param args
	 */
	private _addToAssetEditableQueue(args = {}) {

		this.assetEditableQueue.push(args);

		// If there is more than 1 item in the queue, it will be picked up auto-magically
		if (this.assetEditableQueue.length === 1) {
			this._checkAssetsEditable();
		}

	}

	/**
	 * Check if a list of assets is editable
	 */
	private _checkAssetsPublished() {

		if (!this.assetPublishedRequest) {
			this.assetPublishedRequest = new PublishStatus({
				apiUrl: this.apiUrl,
				accessKey: this.accessKey,
			});
		}

		this.assetPublishedRequest.execute({
			assets: this.assetPublishedQueue.map((thisQueueItem) => thisQueueItem.asset),
		}).then((publishStatuses) => {

			const resolveSet: any = {};

			publishStatuses
				.filter((thisStatus: any) => thisStatus.published)
				.forEach((thisPublishedStatus: any) => {

					const queueIndex = this.assetPublishedQueue.findIndex(
						(thisQueueItem) => thisQueueItem.asset.id === thisPublishedStatus.id,
					);
					const queueItem = this.assetPublishedQueue[queueIndex];

					// remove it from the queue
					this.assetPublishedQueue.splice(queueIndex, 1);

					// add the item to a resolving set
					resolveSet[queueItem.asset.id] = queueItem.resolve;

				});

			if (Object.keys(resolveSet).length) {
				this._resolvePublishedAssets(resolveSet);
			}

			if (this.assetPublishedQueue.length > 0) {
				setTimeout(
					this._checkAssetsPublished.bind(this),
					Upload.ASSET_PUBLISHED_TIMEOUT,
				);
			}

		});

	}

	/**
	 * Fulfills the promises from the queue
	 * @param resolveSet
	 */
	private _resolvePublishedAssets(resolveSet: any) {

		const assetsInformationRequest = new Assets({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		assetsInformationRequest.execute({
			assets: Object.keys(resolveSet).map((thisId) => {
				return {id: thisId};
			}),
		}).then((assets) => {

			assets.forEach((thisAsset: any) => {
				resolveSet[thisAsset.id](thisAsset);
			});

		});

	}

	/**
	 * Check if a list of assets is editable
	 */
	private _checkAssetsEditable() {

		if (!this.assetBasicInformationRequest) {
			this.assetBasicInformationRequest = new AssetsBasicInformation({
				apiUrl: this.apiUrl,
				accessKey: this.accessKey,
			});
		}

		this.assetBasicInformationRequest.execute({
			assets: this.assetEditableQueue.map((thisQueueItem) => thisQueueItem.asset),
		}).then((basicAssets: Asset[]) => {

			// Resolve the promise for the found assets
			basicAssets.forEach((thisBasicAsset) => {

				const queueIndex = this.assetEditableQueue.findIndex(
					(thisQueueItem) => thisQueueItem.asset.id === thisBasicAsset.id,
				);

				// Item found?
				if (queueIndex > -1) {
					const queueItem = this.assetEditableQueue[queueIndex];

					// remove it from the queue
					this.assetEditableQueue.splice(queueIndex, 1);

					queueItem.asset.type = thisBasicAsset.type;
					queueItem.resolve(queueItem.asset);
				}

			});

			if (this.assetEditableQueue.length > 0) {
				setTimeout(
					this._checkAssetsEditable.bind(this),
					Upload.ASSET_EDITABLE_TIMEOUT,
				);
			}

		});

	}

}

// Attach endpoint
const name = 'upload';
const getter = function (instance: ConnectorType) {
	return new Upload({
		apiUrl: instance.apiUrl,
		apiVersion: instance.apiVersion,
		computerName: instance.state.config.UploadName,
		instance,
		accessKey: instance.state.user.accessKey,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		upload: Upload;
	}
}
