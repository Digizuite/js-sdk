import {InformationItem} from './informationItem';

export interface IAssetInformationArgs {
	assetId: string | null;
	informationItems: InformationItem[];
}

export class AssetInformation {
	public informationItems: InformationItem[];
	public assetId: number | null;

	constructor(args: IAssetInformationArgs) {

		this.assetId = args.assetId ? parseInt(args.assetId, 10) : null;
		this.informationItems = args.informationItems || [];

	}

}
