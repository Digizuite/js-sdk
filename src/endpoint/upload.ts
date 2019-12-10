import {Endpoint, IEndpointArgs} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {GUID} from '../const';
import {Asset} from '../model/asset';
import {CloudFile} from '../model/cloudFile';
import {BitMetadataItem} from '../model/metadata/bitMetadataItem';
import {NotificationActionType} from "../model/notification/notification";
import {UploadTicket} from '../model/ticket/uploadTicket';
import {createDigiUploader} from '../utilities/digiUploader/digiUploaderProvider';
import {DigiUploadFile, IDigiUploader} from '../utilities/digiUploader/IDigiUploader';
import {AssetCreatedQueue} from "../utilities/finishUploadQueue/assetCreatedQueue";
import { AssetPublishedQueue } from '../utilities/finishUploadQueue/assetPublishedQueue';
import {Notifications} from './notifications';

export interface IUploadEndpointArgs extends IEndpointArgs {
	computerName: string;
	instance: ConnectorType;
	notifications: Notifications;
}

export class Upload extends Endpoint {
	private instance: ConnectorType;
	private digiUpload: IDigiUploader;

	private readonly assetCreatedQueue: AssetCreatedQueue;
	private readonly assetPublishedQueue: AssetPublishedQueue;
	private readonly notifications: Notifications;

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
		});

		this.notifications = args.notifications;

		this.assetCreatedQueue = new AssetCreatedQueue({
			apiUrl: args.apiUrl,
			accessKey: args.accessKey || '',
		});

		this.assetPublishedQueue = new AssetPublishedQueue({
			apiUrl: args.apiUrl,
			accessKey: args.accessKey || '',
		});

		// Notifications
		this.subSink.sink = this.notifications.assetPushNotification.subscribe(notification => {
			if (notification.notificationGroup.actionType === NotificationActionType.AssetCreated) {
				this.assetCreatedQueue.onAssetCreated(notification.assetItemId);
			} else {
				this.assetPublishedQueue.onAssetPublished(notification.assetItemId);
			}
		});
	}

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
	 * Returns a promise that resolves when the asset is created
	 * @param asset
	 * @returns {Promise}
	 */
	public awaitAssetCreated(asset: Asset) {

		if (!(asset instanceof Asset)) {
			throw new Error('awaitAssetEditable expects an asset as parameter');
		}

		return new Promise(resolve => this.assetCreatedQueue.insert(asset, resolve));
	}

	/**
	 * @deprecated
	 * @param asset
	 */
	public awaitAssetEditable(asset: Asset) {
		return this.awaitAssetCreated(asset);
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

		return new Promise((resolve) => this.assetPublishedQueue.insert(asset, resolve));
	}

}

// Attach endpoint
const name = 'upload';
const getter = function (instance: ConnectorType) {
	return new Upload({
		apiUrl: instance.state.constants.baseApiUrl,
		computerName: instance.state.config.UploadName,
		instance,
		accessKey: instance.state.user.accessKey,
		notifications: instance.notifications,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		upload: Upload;
	}
}
