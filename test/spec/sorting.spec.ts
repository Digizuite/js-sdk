import {Connector} from "../../src/connector";
import {SORT_BY, SORT_DIRECTION} from '../../src/const';
import {getInstance} from '../test-helpers';
import {Asset} from "../../src/model/asset";

describe('Sorting', () => {

	let instance: Connector;

	beforeAll(async () => {
		instance = await getInstance();
	});

	it('Should give assets sorted descending', async () => {
		const {assets} = await instance.content.getAssets({
			sorting: {
				by: SORT_BY.DATE,
				direction: SORT_DIRECTION.DESCENDING,
			},
		});

		for (let i = 1; i < assets.length; i++) {
			const asset1 = assets[i - 1].date;
			const asset2 = assets[i].date;

			if (!asset1 || !asset2) {
				throw new Error('One of the assets is null');
			}

			asset1.setMilliseconds(0);
			asset2.setMilliseconds(0);

			expect(asset1.getTime() >= asset2.getTime()).toBe(true, "Assets was not sorted correctly");
		}
	});

	it('should give assets sorted ascended', async () => {
		const {assets} = await instance.content.getAssets({
			sorting: {
				by: SORT_BY.DATE,
				direction: SORT_DIRECTION.ASCENDING,
			},
		});

		for (let i = 1; i < assets.length; i++) {
			const asset1 = assets[i - 1].date;
			const asset2 = assets[i].date;

			if (!asset1 || !asset2) {
				throw new Error('One of the assets is null');
			}

			asset1.setMilliseconds(0);
			asset2.setMilliseconds(0);
			expect(asset1.getTime() <= asset2.getTime()).toBe(true, "Assets was not sorted correctly");
		}
	});

	// Disabled due to DAM Center being retarded. See DAM-2319
	describe('Sorting by name', () => {
		xit('should give assets sorted by name accending', async () => {
			const {assets} = await instance.content.getAssets({
				sorting: {
					by: SORT_BY.NAME,
					direction: SORT_DIRECTION.ASCENDING,
				},
			});

			const getAssetName = (asset: Asset): string => {
				return (asset.name || '').replace(/_/g, '').toLowerCase();
			};

			for (let i = 1; i < assets.length; i++) {
				const asset1 = getAssetName(assets[i - 1]);
				const asset2 = getAssetName(assets[i]);
				expect(asset1 <= asset2).toBe(true, 'alpha sorting did not work.');
			}
		});

		it('should give assets sorted by name descending', async () => {
			const {assets} = await instance.content.getAssets({
				sorting: {
					by: SORT_BY.NAME,
					direction: SORT_DIRECTION.DESCENDING,
				},
			});

			for (let i = 1; i < assets.length; i++) {
				const asset1 = assets[i - 1];
				const asset2 = assets[i];
				expect(asset1.name!.toLowerCase() >= asset2.name!.toLowerCase())
					.toBe(true, 'alpha sorting did not work.');
			}
		});
	});

	it('should sort advanced', async () => {
		const sortCriteriaAvailable = instance.content.getSortBy();

		const {assets} = await instance.content.getAssets({
			sorting: {
				by: sortCriteriaAvailable[0].by,
				direction: SORT_DIRECTION.ASCENDING,
			},
		});
		expect(assets).not.toBeNull();
		expect(assets.length > 0).toBe(true);
	});
});
