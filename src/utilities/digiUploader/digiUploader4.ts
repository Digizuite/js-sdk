import {CloudFile} from '../../model/cloudFile';
import {ReplaceTicket} from '../../model/ticket/replaceTicket';
import {RestoreTicket} from '../../model/ticket/restoreTicket';
import {UploadTicket} from '../../model/ticket/uploadTicket';
import {CopyMetadata} from '../../request/metadataService/copyMetadata';
import {CreateUpload} from '../../request/uploadService/createUpload';
import {FinishUpload} from '../../request/uploadService/finishUpload';
import {ItemIdUpload} from '../../request/uploadService/itemIdUpload';
import {SetArchiveReplace} from '../../request/uploadService/setArchiveReplace';
import {SetAssetId} from '../../request/uploadService/setAssetId';
import {SetFileName} from '../../request/uploadService/setFileName';
import {SetMetaSource} from '../../request/uploadService/setMetaSource';
import {SetTransferMode} from '../../request/uploadService/setTransferMode';
import {SubmitUpload} from '../../request/uploadService/submitUpload';
import {greaterOrEqualThan} from '../damVersionCompare';
import {BaseDigiUploader, IBaseDigiUploaderArgs} from "./baseDigiUploader";
import {IDigiUploader, IDigiUploaderGetUploadIdsArgs} from "./IDigiUploader";

export interface IDigiUploader4Args extends IBaseDigiUploaderArgs {
	computerName: string;
	apiVersion: string;
}

export class DigiUploader4 extends BaseDigiUploader implements IDigiUploader {

	private readonly computerName: string;
	private readonly apiVersion: string;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {string} args.computerName
	 */
	constructor(args: IDigiUploader4Args) {
		super({
			apiUrl: args.apiUrl,
			accessKey: args.accessKey,
		});

		this.computerName = args.computerName;
		this.apiVersion = args.apiVersion;
	}

	get SUPPORTS_FAST_FINISH_UPLOAD() {
		return greaterOrEqualThan(this.apiVersion, '4.7.1');
	}

	/**
	 * Finishes an upload.
	 * Determines which version of finish upload to use based on DAM version
	 * @param {UploadTicket|ReplaceTicket} ticket
	 */
	public finishUpload(ticket: UploadTicket) {

		return this.SUPPORTS_FAST_FINISH_UPLOAD ?
			this._finishUploadFast(ticket) :
			this._finishUploadSlow(ticket);

	}

	/**
	 * Finishes an upload, the fast way.
	 * @param {UploadTicket|ReplaceTicket} ticket
	 */
	public _finishUploadFast(ticket: UploadTicket | RestoreTicket) {

		let preFinishPromise;

		// When restoring an asset, we also need to restore its metadata
		if (ticket instanceof RestoreTicket) {
			const copyMetadataRequest = new CopyMetadata({
				apiUrl: this.apiUrl,
				accessKey: this.accessKey,
			});

			preFinishPromise = copyMetadataRequest.execute({ticket});
		} else {
			preFinishPromise = Promise.resolve();
		}

		const finishUploadRequest = new FinishUpload({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		// No one knows copyMetadata needs to be ran or not before submitting the upload.
		// Historically speaking, it was used before, but again, no one knows!!
		// Let's just play it safe...
		return preFinishPromise.then(() => finishUploadRequest.execute({ticket}));
	}

	/**
	 * Finishes an upload, the slow way.
	 * @param {UploadTicket|ReplaceTicket} ticket
	 */
	public _finishUploadSlow(ticket: UploadTicket) {

		const setTransferModeRequest = new SetTransferMode({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		const submitUploadRequest = new SubmitUpload({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		// Valid for all uploads
		const requests = [
			setTransferModeRequest.execute({ticket}),
		];

		// Set file name should be done for all except Cloud Files
		if (!(ticket.file instanceof CloudFile)) {

			const setFileNameRequest = new SetFileName({
				apiUrl: this.apiUrl,
				accessKey: this.accessKey,
			});

			requests.push(
				setFileNameRequest.execute({ticket}),
			);

		}

		// Common for restore or replace
		if (
			(ticket instanceof ReplaceTicket) ||
			(ticket instanceof RestoreTicket)
		) {

			const setAssetIdRequest = new SetAssetId({
				apiUrl: this.apiUrl,
				accessKey: this.accessKey,
			});

			const setArchiveReplaceRequest = new SetArchiveReplace({
				apiUrl: this.apiUrl,
				accessKey: this.accessKey,
			});

			requests.push(
				setAssetIdRequest.execute({ticket}),
			);

			requests.push(
				setArchiveReplaceRequest.execute({uploadId: ticket.uploadId}),
			);
		}

		// Specific to replace
		if (
			(ticket instanceof ReplaceTicket) &&
			!(ticket instanceof RestoreTicket)
		) {
			const setMetaSourceRequest = new SetMetaSource({
				apiUrl: this.apiUrl,
				accessKey: this.accessKey,
			});

			requests.push(
				setMetaSourceRequest.execute({uploadId: ticket.uploadId}),
			);
		}

		// Specific to restore
		if (ticket instanceof RestoreTicket) {
			const copyMetadataRequest = new CopyMetadata({
				apiUrl: this.apiUrl,
				accessKey: this.accessKey,
			});

			requests.push(
				copyMetadataRequest.execute({ticket}),
			);
		}

		// Submit!
		return Promise.all(requests).then(() => {
			return submitUploadRequest.execute({ticket});
		});
	}

	/**
	 * Get upload ID
	 * @param {Object} args
	 * @param {File} [args.file]
	 * @param {String} [args.filename]
	 * @param {String} [args.name]
	 * @returns {Promise.<Object>}
	 */
	public getUploadIds(args: IDigiUploaderGetUploadIdsArgs): Promise<{ itemId: number, uploadId: number }> {

		const createUploadRequest = new CreateUpload({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		// Create an upload request
		return createUploadRequest.execute({
			computerName: this.computerName,
			file: args.file,
			filename: args.filename,
			name: args.name,
		}).then((createUploadResult: { itemId: number, uploadId: number }) => {

			// In DAM 4.8.0 or earlier, itemId was set to 0.
			// Which required an additional request to be made
			if (createUploadResult.itemId) {
				return createUploadResult;
			} else {
				return this._getUploadIdsFromUploadId(createUploadResult.uploadId);
			}

		});
	}

	/**
	 * Returns itemId and uploadID from an uploadId
	 * @param uploadId
	 * @returns {Promise.<Object>}
	 * @private
	 */
	public _getUploadIdsFromUploadId(uploadId: number): Promise<{ itemId: number, uploadId: number }> {

		const itemIdUploadRequest = new ItemIdUpload({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return itemIdUploadRequest.execute({
			uploadId,
		}).then(({itemId}) => {
			return {itemId, uploadId};
		});

	}

}
