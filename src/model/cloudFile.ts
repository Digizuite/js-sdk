export interface ICloudFileArgs {
    location: string;
    size: number;
    name?: string;
}

export class CloudFile {
    location: string;
    size: number;
    name: string;

    constructor(args: ICloudFileArgs) {
        this.location = args.location;
        this.size = args.size;
        this.name = args.name ? args.name : this._getNameFromLocation(args.location);
    }

    /**
     * Returns a name from location
     * @param {string} location
     * @returns {string}
     * @private
     */
    private _getNameFromLocation(location: string): string {
        return location.substring( location.lastIndexOf('/') + 1 );
    }
}