import {Asset} from "../../model/asset";
import {Assets} from "../../request/searchService/assets";
import {PublishStatus} from "../../request/searchService/publishStatus";
import {IQueuedAsset, WaitQueue} from "./waitQueue";

export interface IAssetPublishedQueueArgs {
	apiUrl: string;
	accessKey: string;
}

const ASSET_PUBLISHED_TIMEOUT = 20000;

export class AssetPublishedQueue extends WaitQueue {

	private readonly assetPublishedRequest: PublishStatus;
	private readonly assetsInformationRequest: Assets;

	constructor(args: IAssetPublishedQueueArgs) {
		super({
			timeout: ASSET_PUBLISHED_TIMEOUT,
		});

		this.assetPublishedRequest = new PublishStatus({
			apiUrl: args.apiUrl,
			accessKey: args.accessKey,
		});

		this.assetsInformationRequest = new Assets({
			apiUrl: args.apiUrl,
			accessKey: args.accessKey,
		});
	}

	public onAssetPublished(id: number) {
		this._onAssetsDataReceived([
			new Asset({ id }),
		]);
	}

	protected _fetchData(): Promise<Asset[]> {
		return this.assetPublishedRequest.execute({
			assets: this.queue.map((thisQueueItem) => thisQueueItem.asset),
		}).then(publishStatuses => {
			return publishStatuses
				.filter(thisStatus => thisStatus.published)
				.map(thisPublishedStatus => new Asset({ id: thisPublishedStatus.id }));
		});
	}

	protected _resolveAssets(resolveMap: Map<number, IQueuedAsset>) {
		this.assetsInformationRequest.execute({
			assets: Array.from(resolveMap.values()).map(({asset}) => asset),
		}).then(assets => {
			assets.forEach(thisAsset => {
				const queueItem = resolveMap.get(thisAsset.id || 0);
				if (queueItem) {
					queueItem.resolve(thisAsset);
				}
			});
		});
	}

}
