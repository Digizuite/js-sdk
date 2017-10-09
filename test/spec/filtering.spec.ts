import {Connector} from "../../src/connector";
import {AssetCreatedFilter, AssetFreeTextFilter, AssetTypeFilter, Constants} from '../../src/index';
import {getInstance} from '../test-helpers';

describe('Filtering', () => {
	/**
	 * @typeof {Connector}
	 */
	let instance: Connector;

	beforeAll(async () => {
		instance = await getInstance();
	});

	it('Should filter for asset text', async () => {

		const assetFreeTextFilter = new AssetFreeTextFilter({
			text: 'moon',
		});
		const {assets} = await instance.content.getAssets({
			filters: [assetFreeTextFilter],
		});
		expect(assets).not.toBeNull();
		expect(assets.length > 0).toBe(true);
	});

	it('should filter for asset type', async () => {

		const assetTypeFilter = new AssetTypeFilter({
			types: [Constants.ASSET_TYPE.IMAGE],
		});
		const {assets} = await instance.content.getAssets({
			filters: [assetTypeFilter],
		});

		expect(assets).not.toBeNull();
		expect(assets.length > 0).toBe(true);
	});

	it('should filter for creation date', async () => {

		const assetCreatedFilter = new AssetCreatedFilter({
			from: 1494720000,
			to: Math.floor(Date.now() / 1000),
		});
		const {assets} = await instance.content.getAssets({
			filters: [assetCreatedFilter],
		});

		expect(assets).not.toBeNull();
		expect(assets.length > 0).toBe(true);
	});

	it('should get a list of filters', async () => {
		const filters = await instance.content.getFilters();
		expect(filters).not.toBeNull();
	});
});
