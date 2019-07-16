import {Endpoint, IEndpointArgs} from '../common/endpoint';
import {RequestError} from '../common/requestError';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {GUID} from '../const';
import {Asset} from '../model/asset';
import {AssetVersion} from '../model/assetVersion';
import {BitMetadataItem} from '../model/metadata/bitMetadataItem';
import {ReplaceTicket} from '../model/ticket/replaceTicket';
import {RestoreTicket} from '../model/ticket/restoreTicket';
import {AssetVersions} from '../request/searchService/assetVersions';
import {createDigiUploader} from "../utilities/digiUploader/digiUploaderProvider";
import {DigiUploadFile, IDigiUploader} from '../utilities/digiUploader/IDigiUploader';
import {getLockInformation} from '../utilities/lockInformation';

export interface IVersionEndpointArgs extends IEndpointArgs {
	computerName: string;
	apiVersion: string;
	instance: ConnectorType;
}

export class Version extends Endpoint {
	private instance: ConnectorType;
	private digiUpload: IDigiUploader;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {string} args.computerName
	 */
	constructor(args: IVersionEndpointArgs) {

		super(args);

		this.digiUpload = createDigiUploader({
			computerName: args.computerName,
			apiUrl: args.apiUrl,
			accessKey: args.accessKey || '',
			apiVersion: args.apiVersion,
		});

		this.instance = args.instance;
	}

	/**
	 * Returns a promise that resolved to a replace ticket
	 * @param args
	 * @returns {Promise.<ReplaceTicket>}
	 */
	public requestReplaceTicket(args: { asset: Asset, file: DigiUploadFile }): Promise<ReplaceTicket> {

		if (!(args.asset instanceof Asset)) {
			throw new Error('Replace expect an asset as parameter');
		}

		return this.digiUpload.getUploadIds({file: args.file})
			.then((result) => {
				return new ReplaceTicket({
					asset: args.asset,
					file: args.file,
					itemId: result.itemId,
					uploadId: result.uploadId,
				});
			});

	}

	/**
	 * Returns a promise that resolved to a restore ticket
	 * @param args
	 * @param {Asset} args.asset
	 * @param {AssetVersion} args.version
	 * @returns {Promise.<RestoreTicket>}
	 */
	public requestRestoreTicket(args: { asset: Asset, version: AssetVersion }): Promise<RestoreTicket> {

		if (!(args.asset instanceof Asset)) {
			throw new Error('Restore expect an asset as parameter');
		}

		if (!(args.version instanceof AssetVersion)) {
			throw new Error('Restore expect an asset version as parameter');
		}

		return this.digiUpload.getUploadIds({
			filename: args.version.getFilename(),
			name: args.asset.name,
		}).then((result) => {
			return new RestoreTicket({
				asset: args.asset,
				itemId: result.itemId,
				uploadId: result.uploadId,
				version: args.version,
			});
		});

	}

	/**
	 * Replace asset from ticket
	 * @param args
	 * @param {ReplaceTicket} args.ticket
	 * @returns {Promise.<>}
	 */
	public replaceAssetByTicket(args: { ticket: ReplaceTicket }): Promise<any> {

		if (!(args.ticket instanceof ReplaceTicket)) {
			throw new Error('Replace expect a replace ticket as parameter');
		}

		return getLockInformation({
			apiUrl: this.apiUrl,
			asset: args.ticket.asset,
			accessKey: this.accessKey,
		}).then((lockInfo) => {

				if (lockInfo.isLocked) {
					throw new RequestError('Asset is being locked', 6660);
				}

				return this.digiUpload.uploadFile(args.ticket);

			})
			.then(() => this._markPublishingInProgress(args.ticket))
			.then(() => this.digiUpload.finishUpload(args.ticket))
			.then(() => {
				return {};
			});
	}

	/**
	 * Restore an asset from ticket
	 * @param args
	 * @param {ReplaceTicket} args.ticket
	 * @returns {Promise.<>}
	 */
	public restoreAssetByTicket(args: { ticket: ReplaceTicket }): Promise<void> {

		if (!(args.ticket instanceof RestoreTicket)) {
			throw new Error('Restore expect a replace ticket as parameter');
		}

		return getLockInformation({
			apiUrl: this.apiUrl,
			asset: args.ticket.asset,
			accessKey: this.accessKey,
		}).then((lockInfo) => {

			if (lockInfo.isLocked) {
				throw new RequestError('Asset is being locked', 6660);
			}

			return this.digiUpload.finishUpload(args.ticket)
				.then(() => undefined);
		});

	}

	/**
	 * Get a list of asset versions
	 * @param args
	 * @param {Asset} args.asset
	 * @returns {Promise.<AssetVersion[]>}
	 */
	public getAssetVersions(args: { asset: Asset }): Promise<AssetVersion[]> {

		if (!(args.asset instanceof Asset)) {
			throw new Error('getAssetVersions expect an asset as parameter');
		}

		const assetVersionsRequest = new AssetVersions({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return assetVersionsRequest.execute({
			asset: args.asset,
		});
	}

	/**
	 * Marks an asset as being in publish
	 * @param ticket
	 */
	private _markPublishingInProgress(ticket: ReplaceTicket) {

		const publishInProgressItem = new BitMetadataItem({
			guid: GUID.PUBLISH_IN_PROGRESS,
			value: true,
		});

		return this.instance.metadata.updateMetadataItems({
			assets: [ticket.asset],
			metadataItems: [publishInProgressItem],
		});

	}

}

// Attach endpoint
const name = 'version';
const getter = function (instance: ConnectorType) {
	return new Version({
		apiUrl: instance.apiUrl,
		apiVersion: instance.apiVersion,
		computerName: instance.state.config.UploadName,
		accessKey: instance.state.user.accessKey,
		instance,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		version: Version;
	}
}
