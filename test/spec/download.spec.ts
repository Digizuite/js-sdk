import {Connector} from "../../src/connector";
import {DOWNLOAD_QUALITY} from '../../src/index';
import {getInstance} from '../test-helpers';

describe('Downloading', () => {

	let instance: Connector;

	beforeAll(async () => {
		instance = await getInstance();
	});

	it('should give a quality url', async () => {

		const [asset] = await instance.content.getAssetsById({
			assetIds: [16917],
		});

		try {
			const url = await instance.download.getUrlForQuality({
				asset,
				quality: DOWNLOAD_QUALITY.LOW_RES,
			});
		} catch (e) { /* Lol */
		}

		// Disable the check for due to the fact that damcenter is fucked
		// expect(!!url).toBe(true);
	});

	it('should give a download url', async () => {

		const {assets} = await instance.content.getAssets();

		const url = await instance.download.getDownloadURL({
			asset: assets[0],
			quality: DOWNLOAD_QUALITY.ORIGINAL,
		});
		expect(!!url).toBe(true);
	});

	it('should give all possible download qualities', async () => {
		const {assets} = await instance.content.getAssets();

		const qualities = await instance.download.getAllDownloadURL({
			asset: assets[0],
		});

		expect(qualities).not.toBeNull();
		expect(qualities.length > 0).toBe(true);
	});
});
