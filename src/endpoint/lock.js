import {attachEndpoint} from '../connector';
import {Endpoint} from '../common/endpoint';
import {CheckIn} from '../request/itemControlService/checkIn';
import {CheckOut} from '../request/itemControlService/checkOut';
import {getLockInformation} from '../utilities/lockInformation';

export class Lock extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 */
	constructor(args = {}) {
		super(args);
	}
	
	/**
	 * Lock an asset
	 * @param {Object} args
	 * @param {Asset} args.asset - Asset for which to set the lock
	 * @param {String} [args.note] - Note for locking the asset
	 * @returns {Promise.<>}
	 */
	lockAsset( args = {} ) {
		
		if (!args.asset) {
			throw new Error('lockAsset expected an asset as parameter!');
		}
		
		const checkOutRequest = new CheckOut({
			apiUrl : this.apiUrl,
		});
		
		return checkOutRequest.execute({
			asset: args.asset,
			note : args.note,
		}).then( () => undefined );
	}
	
	/**
	 * Unlock an asset
	 * @param {Object} args
	 * @param {Asset} args.asset - Asset to unlock
	 * @param {String} [args.note] - Note for unlocking the asset
	 * @returns {Promise.<>}
	 */
	unlockAsset( args = {} ) {
		
		if (!args.asset) {
			throw new Error('unlockAsset expected an asset as parameter!');
		}
		
		const checkInRequest = new CheckIn({
			apiUrl : this.apiUrl,
		});
		
		return checkInRequest.execute({
			asset: args.asset,
			note : args.note,
		}).then( () => undefined );
	}
	
	/**
	 * Returns the lock information for a given asset
	 * @param {Object} args
	 * @param {Asset} args.asset - Asset for which to get the lock information
	 * @returns {Promise.<Lock>}
	 */
	getLockInformation(args = {}) {
		
		if (!args.asset) {
			throw new Error('getLockInformation expected an asset as parameter!');
		}
		
		return getLockInformation({
			asset : args.asset,
			apiUrl : this.apiUrl
		});
	}
	
}

// Attach endpoint
const name = 'lock';
const getter = function (instance) {
	return new Lock({
		apiUrl          : instance.apiUrl
	});
};

attachEndpoint({ name, getter });
