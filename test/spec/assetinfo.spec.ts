import {getInstance} from '../test-helpers';

describe('Asset information', () => {
	it('should get asset information', async () => {
		const instance = await getInstance();

		const {assets} = await instance.content.getAssets();
		const asset = assets[0];

		const results = await instance.content.getAssetsInformation({
			assets: [asset],
		});

		results.forEach(result => {
			result.informationItems.forEach(item => {
				expect(item.name).not.toBe('');
				expect(item.id).not.toBe('');
				if (item.value) {
					expect(item.getFormattedValue()).not.toBe('');
				}
			});
		});
	});
});
