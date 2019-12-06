import {ReplaceTicket} from "../../model/ticket/replaceTicket";
import {RestoreTicket} from "../../model/ticket/restoreTicket";
import {UploadTicket} from "../../model/ticket/uploadTicket";
import {InitiateUpload} from "../../request/uploadService/initiateUpload";
import {ReplaceAsset} from "../../request/uploadService/replaceAsset";
import {UploadAsset} from "../../request/uploadService/uploadAsset";
import {BaseDigiUploader, IBaseDigiUploaderArgs} from "./baseDigiUploader";
import {IDigiUploader, IDigiUploaderGetUploadIdsArgs} from "./IDigiUploader";

export interface IDigiUploaderArgs extends IBaseDigiUploaderArgs {
	computerName: string;
}

export class DigiUploader extends BaseDigiUploader implements IDigiUploader {

	private readonly computerName: string;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {string} args.computerName
	 */
	constructor(args: IDigiUploaderArgs) {
		super({
			apiUrl: args.apiUrl,
			accessKey: args.accessKey,
		});

		this.computerName = args.computerName;
	}

	/**
	 * Get upload ids
	 * @param args
	 */
	public getUploadIds(args: IDigiUploaderGetUploadIdsArgs): Promise<{ itemId: number; uploadId: number }> {
		const initiateUploadRequest = new InitiateUpload({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return initiateUploadRequest.execute({
			computerName: this.computerName,
			file: args.file,
			filename: args.filename,
			name: args.name,
		});
	}

	/**
	 * Finish upload
	 * @param ticket
	 */
	public finishUpload(ticket: UploadTicket|ReplaceTicket|RestoreTicket): Promise<void> {
		if (ticket instanceof RestoreTicket) {
			return this._finishRestoreTicket(ticket);
		} else if (ticket instanceof ReplaceTicket) {
			return this._finishReplaceTicket(ticket);
		} else {
			return this._finishUploadTicket(ticket);
		}
	}

	/**
	 * Replace an asset
	 * @param ticket
	 * @private
	 */
	private _finishRestoreTicket(ticket: RestoreTicket): Promise<void> {
		const initiateUploadRequest = new ReplaceAsset({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return initiateUploadRequest.execute({
			itemId: ticket.itemId,
			uploadId: ticket.uploadId,
			targetAssetId: ticket.asset.IAgreeWithKittensBeingDeadSoThatICanUseAssetId(),
			sourceAssetId: ticket.version.IAgreeWithKittensBeingDeadSoThatICanUseAssetId(),
		});
	}

	/**
	 * Replace an asset
	 * @param ticket
	 * @private
	 */
	private _finishReplaceTicket(ticket: ReplaceTicket): Promise<void> {
		const initiateUploadRequest = new ReplaceAsset({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return initiateUploadRequest.execute({
			itemId: ticket.itemId,
			uploadId: ticket.uploadId,
			targetAssetId: ticket.asset.IAgreeWithKittensBeingDeadSoThatICanUseAssetId(),
		});
	}

	/**
	 * Upload an asset
	 * @param ticket
	 * @private
	 */
	private _finishUploadTicket(ticket: UploadTicket): Promise<void> {
		const initiateUploadRequest = new UploadAsset({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return initiateUploadRequest.execute({
			itemId: ticket.itemId,
			uploadId: ticket.uploadId,
		});
	}

}
