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
    isCurrentVersion: boolean;
    _sourceLocation: string | undefined;
    thumbnail: string | undefined;
    versionId: number | undefined;
    id: number | undefined;
    type: number | undefined;

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
        this._sourceLocation = args.sourceLocation;
        this.isCurrentVersion = !!args.isCurrentVersion;

    }

    /**
     * Populates an asset from with the API values
     * @param args
     */
    setValueFromAPI(args: any) {

        this.id = parseInt(args.itemId, 10);
        this.type = parseInt(args.assetType, 10);

        this._sourceLocation = args.sourceLocation;

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
    getFilename() {
        return this._sourceLocation!.substring(this._sourceLocation!.lastIndexOf('\\') + 1);
    }

    /**
     * Returns source location
     * @returns {*}
     */
    getSourceLocation() {
        return this._sourceLocation;
    }

}