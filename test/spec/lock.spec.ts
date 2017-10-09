import {Connector} from "../../src/connector";
import {getInstance} from '../test-helpers';

describe('Lock', () => {

	let instance: Connector;

	beforeAll(async () => {
		instance = await getInstance();
	});

	it('should lock and unlock and asset', async () => {

		const {assets} = await instance.content.getAssets({
			navigation: {limit: 50},
		});

		const asset = assets[35];

		await instance.lock.lockAsset({asset, note: 'Halloy'});
		const lockInfo = await instance.lock.getLockInformation({asset});

		expect(lockInfo.isLocked).toBe(true);

		await instance.lock.unlockAsset({asset, note: 'Halloy'});

		const unlockInfo = await instance.lock.getLockInformation({asset});
		expect(unlockInfo.isLocked).toBe(false);

	});

});
