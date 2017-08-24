import {DigiUploadFile} from "../../utilities/digiUploader";

export interface IUploadTicketArgs {
    itemId: number;
    uploadId: number;
    file?: DigiUploadFile;
}

export class UploadTicket {
    _progChainId: string | null;
    itemId: number;
    uploadId: number;
    file?: DigiUploadFile;
    onProgress: () => void;
    private _extraJobParams: any | null;

    /**
     * C-tor
     * @param args
     */
    constructor(args: IUploadTicketArgs) {
        this.itemId = args.itemId;
        this.uploadId = args.uploadId;
        this.file = args.file;
        this.onProgress = function() {};

        // for extended Job
        this._progChainId = null;
        this._extraJobParams = null;
    }

    /**
     * Extends a job
     * @param {String} progChainId
     * @param {Object} extraJobParams
     */
    extendJob(progChainId: string, extraJobParams: any) {

        this._progChainId = progChainId;

        // Yes, extraJobParams is an array of array
        this._extraJobParams = extraJobParams;
    }

    /**
     * Checks is the ticket is an extended job
     * @returns {boolean}
     */
    isExtendedJob() {
        return typeof this._progChainId === 'string' && this._progChainId.length > 0;
    }

    /**
     * Gets parameters for the extra job
     * @returns {{progChainId: (String), extraJobParams: (String)}}
     */
    getExtendedJobParameters() {

        if(!this.isExtendedJob()) {
            throw new Error('Ticker is not an extended job!');
        }

        const extraJobParams = Object.keys( this._extraJobParams )
            .map( thisKey => [ thisKey, this._extraJobParams[thisKey] ] );

        return {
            progChainId : this._progChainId,
            extraJobParams : JSON.stringify(extraJobParams)
        };
    }

}