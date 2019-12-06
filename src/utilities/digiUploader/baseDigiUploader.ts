import {UploadTicket} from "../../model/ticket/uploadTicket";
import {UploadFileChunk} from "../../request/uploadService/uploadFileChunk";

export interface IBaseDigiUploaderArgs {
	apiUrl: string;
	accessKey: string;
}

export abstract class BaseDigiUploader {

	protected readonly apiUrl: string;
	protected readonly accessKey: string;
	private fileChunkUploader: UploadFileChunk | undefined;

	protected constructor(args: IBaseDigiUploaderArgs) {
		this.apiUrl = args.apiUrl;
		this.accessKey = args.accessKey;
	}

	/**
	 * Upload a file
	 * @param {UploadTicket} ticket
	 */
	public uploadFile(ticket: UploadTicket): Promise<void> {

		if (!(ticket instanceof UploadTicket)) {
			throw new Error('Upload expect an upload ticket as parameter');
		}

		this.fileChunkUploader = new UploadFileChunk({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return this.fileChunkUploader.uploadFile(ticket);

	}

}
