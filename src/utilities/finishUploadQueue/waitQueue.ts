import {Asset} from "../../model/asset";

export type ResolveFn = (asset: Asset) => void;

export interface IQueuedAsset {
	asset: Asset;
	resolve: ResolveFn;
}

export interface IWaitQueueArgs {
	timeout: number;
}

export abstract class WaitQueue {

	protected readonly queue: IQueuedAsset[] = [];
	private readonly timeout: number;
	private nextTimeout: any;

	protected constructor(args: IWaitQueueArgs) {
		this.timeout = args.timeout;
	}

	public insert(asset: Asset, resolve: ResolveFn) {
		this.queue.push({ asset, resolve });

		if (this.queue.length === 1) {
			this._doCheck();
		}
	}

	protected abstract _fetchData(): Promise<Asset[]>;
	protected abstract _resolveAssets(resolveMap: Map<number, IQueuedAsset>): void;

	protected _onAssetsDataReceived(assets: Asset[]) {
		const resolveMap = new Map<number, IQueuedAsset>();

		// Resolve the promise for the found assets
		assets.forEach((thisAsset) => {
			const queueIndex = this.queue.findIndex(
				(thisQueueItem) => thisQueueItem.asset.id === thisAsset.id,
			);

			// Item found?
			if (queueIndex > -1) {
				const queueItem = this.queue[queueIndex];

				// remove it from the queue
				this.queue.splice(queueIndex, 1);

				queueItem.asset.setValueFromOtherAsset(thisAsset);
				if (queueItem.asset.id) {
					resolveMap.set(queueItem.asset.id, queueItem);
				}
			}
		});

		if (resolveMap.size) {
			this._resolveAssets(resolveMap);
		}

		if (this.queue.length > 0) {
			this.nextTimeout = setTimeout(
				() => this._doCheck(),
				this.timeout,
			);
		} else if (this.nextTimeout) {
			window.clearTimeout(this.nextTimeout);
		}
	}

	protected _doCheck(): void {
		this._fetchData().then(assets => this._onAssetsDataReceived(assets));
	}

}
