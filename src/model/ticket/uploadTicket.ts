import {DigiUploadFile} from "../../utilities/digiUploader";

export interface IUploadTicketArgs {
	itemId: number;
	uploadId: number;
	file?: DigiUploadFile;
}

export class UploadTicket {
	public itemId: number;
	public uploadId: number;
	public file?: DigiUploadFile;
	public onProgress: () => void;
	private progChainId: string | null;
	private extraJobParams: any | null;

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IUploadTicketArgs) {
		this.itemId = args.itemId;
		this.uploadId = args.uploadId;
		this.file = args.file;
		this.onProgress = function () {
			return undefined;
		};

		// for extended Job
		this.progChainId = null;
		this.extraJobParams = null;
	}

	/**
	 * Extends a job
	 * @param {String} progChainId
	 * @param {Object} extraJobParams
	 */
	public extendJob(progChainId: string, extraJobParams: any) {

		this.progChainId = progChainId;

		// Yes, extraJobParams is an array of array
		this.extraJobParams = extraJobParams;
	}

	/**
	 * Checks is the ticket is an extended job
	 * @returns {boolean}
	 */
	public isExtendedJob() {
		return typeof this.progChainId === 'string' && this.progChainId.length > 0;
	}

	/**
	 * Gets parameters for the extra job
	 * @returns {{progChainId: (String), extraJobParams: (String)}}
	 */
	public getExtendedJobParameters() {

		if (!this.isExtendedJob()) {
			throw new Error('Ticker is not an extended job!');
		}

		const extraJobParams = Object.keys(this.extraJobParams)
			.map((thisKey) => [thisKey, this.extraJobParams[thisKey]]);

		return {
			extraJobParams: JSON.stringify(extraJobParams),
			progChainId: this.progChainId,
		};
	}

}
