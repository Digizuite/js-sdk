import {UploadTicket} from "../../model/ticket/uploadTicket";
import {InitiateUpload} from "../../request/uploadService/initiateUpload";
import {IDigiUploader, IDigiUploaderGetUploadIdsArgs} from "./IDigiUploader";
import {BaseDigiUploader, IBaseDigiUploaderArgs} from "./baseDigiUploader";
import {UploadAsset} from "../../request/uploadService/uploadAsset";

export interface IDigiUploader5Args extends IBaseDigiUploaderArgs {
	computerName: string;
	apiVersion: string;
}

export class DigiUploader5 extends BaseDigiUploader implements IDigiUploader {

	private readonly computerName: string;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {string} args.computerName
	 */
	constructor(args: IDigiUploader5Args) {
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
	public finishUpload(ticket: UploadTicket): Promise<void> {
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
