import {Endpoint} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {Asset} from "../model/asset";
import {Lock as LockModel} from "../model/lock";
import {CheckIn} from '../request/itemControlService/checkIn';
import {CheckOut} from '../request/itemControlService/checkOut';
import {CancelCheckOut} from '../request/itemControlService/cancelCheckOut';
import {getLockInformation} from '../utilities/lockInformation';

export class Lock extends Endpoint {

	/**
	 * Lock an asset
	 * @param {Object} args
	 * @param {Asset} args.asset - Asset for which to set the lock
	 * @param {String} [args.note] - Note for locking the asset
	 * @param {Int} [args.duration] - Duration of locking the asset
	 * @returns {Promise.<>}
	 */
	public lockAsset(args: { asset: Asset, note?: string, duration?: number }): Promise<void> {

		if (!args.asset) {
			throw new Error('lockAsset expected an asset as parameter!');
		}

		if( args.duration ) {
			if( !Number.isInteger(args.duration) || args.duration < 0) {
                throw new Error('lockAsset expected duration to be an duration!');
            }
        }

		const checkOutRequest = new CheckOut({
			apiUrl: this.apiUrl,
		});

		return checkOutRequest.execute({
			asset: args.asset,
			note: args.note,
			checkoutDuration : args.duration || 0
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
		});

		return checkInRequest.execute({
			asset: args.asset,
			note: args.note,
		}).then(() => undefined);
	}

    /**
     * Force unlock an asset
     * @returns {Promise<void>}
     */
    public removeAssetLock(args: { asset: Asset, note?: string }): Promise<void> {
        return this.cancelCheckout({
            asset : args.asset,
            note : args.note,
            force : false
        });
    }

    /**
	 * Force unlock an asset
     * @returns {Promise<void>}
     */
	public forceRemoveAssetLock(args: { asset: Asset, note?: string }): Promise<void> {
		return this.cancelCheckout({
			asset : args.asset,
			note : args.note,
			force : true // use the force, Luke!
		});
	}

    /**
	 * Cancel checkout
     * @returns {Promise<void>}
     */
	protected cancelCheckout(args: { asset: Asset, force: boolean, note?: string }): Promise<void> {

        if (!args.asset) {
            throw new Error('unlockAsset expected an asset as parameter!');
        }

        const cancelCheckOutRequest = new CancelCheckOut({
            apiUrl: this.apiUrl,
        });

        return cancelCheckOutRequest.execute({
            asset: args.asset,
            note: args.note,
			force : args.force
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
		});
	}

}

// Attach endpoint
const name = 'lock';
const getter = function (instance: ConnectorType) {
	return new Lock({
		apiUrl: instance.apiUrl,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		lock: Lock;
	}
}
