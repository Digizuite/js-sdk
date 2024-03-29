import {Endpoint} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {Asset} from "../model/asset";
import {Lock as LockModel} from "../model/lock";
import {CheckIn} from '../request/itemControlService/checkIn';
import {CheckOut} from '../request/itemControlService/checkOut';
import {getLockInformation} from '../utilities/lockInformation';

export class Lock extends Endpoint {

	/**
	 * Lock an asset
	 * @param {Object} args
	 * @param {Asset} args.asset - Asset for which to set the lock
	 * @param {String} [args.note] - Note for locking the asset
	 * @returns {Promise.<>}
	 */
	public lockAsset(args: { asset: Asset, note?: string }): Promise<void> {

		if (!args.asset) {
			throw new Error('lockAsset expected an asset as parameter!');
		}

		const checkOutRequest = new CheckOut({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return checkOutRequest.execute({
			asset: args.asset,
			note: args.note,
		}).then(() => undefined);
	}

	/**
	 * Unlock an asset
	 * @param {Object} args
	 * @param {Asset} args.asset - Asset to unlock
	 * @param {String} [args.note] - Note for unlocking the asset
	 * @returns {Promise.<>}
	 */
	public unlockAsset(args: { asset: Asset, note?: string }): Promise<void> {

		if (!args.asset) {
			throw new Error('unlockAsset expected an asset as parameter!');
		}

		const checkInRequest = new CheckIn({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return checkInRequest.execute({
			asset: args.asset,
			note: args.note,
		}).then(() => undefined);
	}

	/**
	 * Returns the lock information for a given asset
	 * @param {Object} args
	 * @param {Asset} args.asset - Asset for which to get the lock information
	 * @returns {Promise.<Lock>}
	 */
	public getLockInformation(args: { asset: Asset }): Promise<LockModel> {

		if (!args.asset) {
			throw new Error('getLockInformation expected an asset as parameter!');
		}

		return getLockInformation({
			apiUrl: this.apiUrl,
			asset: args.asset,
			accessKey: this.accessKey,
		});
	}

}

// Attach endpoint
const name = 'lock';
const getter = function (instance: ConnectorType) {
	return new Lock({
		apiUrl: instance.state.constants.baseApiUrl,
		accessKey: instance.state.user.accessKey,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		lock: Lock;
	}
}
