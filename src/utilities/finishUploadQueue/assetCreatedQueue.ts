import {Asset} from "../../model/asset";
import {AssetUploadedInformation} from "../../request/searchService/assetUploadedInformation";
import {IQueuedAsset, ResolveFn, WaitQueue} from "./waitQueue";

export interface IAssetCreatedQueueArgs {
	apiUrl: string;
	accessKey: string;
}

const ASSET_CREATED_TIMEOUT = 10000;

export class AssetCreatedQueue extends WaitQueue {

	private readonly assetUploadedInformationRequest: AssetUploadedInformation;

	constructor(args: IAssetCreatedQueueArgs) {
		super({
			timeout: ASSET_CREATED_TIMEOUT,
		});

		this.assetUploadedInformationRequest = new AssetUploadedInformation({
			apiUrl: args.apiUrl,
			accessKey: args.accessKey,
		});
	}

	public onAssetCreated(id: number) {
		this.assetUploadedInformationRequest.execute({
			assets: [new Asset({ id })],
		}).then(assets => this._onAssetsDataReceived(assets));
	}

	protected _fetchData(): Promise<Asset[]> {
		return this.assetUploadedInformationRequest.execute({
			assets: this.queue.map((thisQueueItem) => thisQueueItem.asset),
		});
	}

	protected _resolveAssets(resolveMap: Map<number, IQueuedAsset>) {
		for (const {asset, resolve} of resolveMap.values()) {
			resolve(asset);
		}
	}

}
