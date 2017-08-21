import {getInstance} from 'test-helpers';

describe('Lock', () => {

    let instance;

    beforeAll(async () => {
        instance = await getInstance();
    });
	
	it('should lock and unlock and asset', async () => {
		
		let {assets} = await instance.content.getAssets({
			navigation : { limit : 50 }
		});
		
		const asset = assets[35];
		
		const lock = await instance.lock.lockAsset( { asset, note : 'Halloy' } );
		const lockInfo = await instance.lock.getLockInformation({ asset });
		
		expect(lockInfo.isLocked).toBe(true);
		
		
		const unlock = await instance.lock.unlockAsset( { asset, note : 'Halloy' } );
		
		const unlockInfo = await instance.lock.getLockInformation({ asset });
		expect(unlockInfo.isLocked).toBe(false);
		
	});

});