import {CloudFile} from "../../model/cloudFile";
import {ReplaceTicket} from "../../model/ticket/replaceTicket";
import {RestoreTicket} from "../../model/ticket/restoreTicket";
import {UploadTicket} from "../../model/ticket/uploadTicket";

export type DigiUploadFile = File | CloudFile;

export interface IDigiUploaderGetUploadIdsArgs {
	file?: File | CloudFile;
	filename?: string;
	name?: string;
}

export interface IDigiUploader {

	getUploadIds(args: IDigiUploaderGetUploadIdsArgs): Promise<{ itemId: number, uploadId: number }>;
	uploadFile(ticket: UploadTicket): Promise<void>;
	finishUpload(ticket: UploadTicket|ReplaceTicket|RestoreTicket): Promise<void>;

}
