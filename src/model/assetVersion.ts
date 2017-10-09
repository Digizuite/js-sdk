import {Model} from '../common/model';

export interface IAssetVersionArgs {
	id?: number;
	type?: number;
	versionId?: number;
	thumbnail?: string;
	sourceLocation?: string;
	isCurrentVersion?: string | boolean;
}

export class AssetVersion extends Model {
	public isCurrentVersion: boolean;
	public sourceLocation: string | undefined;
	public thumbnail: string | undefined;
	public versionId: number | undefined;
	public id: number | undefined;
	public type: number | undefined;

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IAssetVersionArgs) {

		super();

		this.id = args.id;
		this.type = args.type;
		this.versionId = args.versionId;
		this.thumbnail = args.thumbnail;
		this.sourceLocation = args.sourceLocation;
		this.isCurrentVersion = !!args.isCurrentVersion;

	}

	/**
	 * Populates an asset from with the API values
	 * @param args
	 */
	public setValueFromAPI(args: any) {

		this.id = parseInt(args.itemId, 10);
		this.type = parseInt(args.assetType, 10);

		this.sourceLocation = args.sourceLocation;

		const versionId = parseInt(args.assetVersionId, 10);
		this.versionId = !Number.isNaN(versionId) ? versionId : 0;

		this.thumbnail = '';
		if (args.hasOwnProperty('thumb')) {
			this.thumbnail = args.thumb.indexOf('?mptdid=0') === -1 ? args.thumb : '';
		}

	}

	/**
	 * Returns the filename from source
	 * @returns {string}
	 */
	public getFilename() {
		return this.sourceLocation!.substring(this.sourceLocation!.lastIndexOf('\\') + 1);
	}

	/**
	 * Returns source location
	 * @returns {*}
	 */
	public getSourceLocation() {
		return this.sourceLocation;
	}

}
