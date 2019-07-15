import {IDigiUploader} from "./IDigiUploader";
import {DigiUploader4, IDigiUploader4Args} from "./digiUploader4";
import {DigiUploader5, IDigiUploader5Args} from "./digiUploader5";
import {greaterOrEqualThan} from '../damVersionCompare';

export function createDigiUploader(args: IDigiUploader4Args | IDigiUploader5Args): IDigiUploader {
    return greaterOrEqualThan(args.apiVersion, '5.1.0') ?
        new DigiUploader5(args as IDigiUploader5Args) : new DigiUploader4(args as IDigiUploader4Args);
}
