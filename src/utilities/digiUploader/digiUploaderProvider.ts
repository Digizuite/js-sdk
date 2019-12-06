import {IDigiUploader} from "./IDigiUploader";
import {DigiUploader, IDigiUploaderArgs} from "./digiUploader";

export function createDigiUploader(args: IDigiUploaderArgs): IDigiUploader {
    return new DigiUploader(args);
}
