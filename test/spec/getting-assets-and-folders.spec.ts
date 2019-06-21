import {Connector} from "../../src/connector";
import {Asset} from '../../src/model/asset';
import {Folder} from "../../src/model/folder";
import {getInstance} from '../test-helpers';

describe('Getting assets and folders', () => {

	let instance: Connector;

	beforeAll(async () => {
		instance = await getInstance();
	});

	it('should give a list of folders', async () => {
		const {folders} = await instance.content.getFolders({path: '/'});
		expect(folders).not.toBeNull();
		expect(folders[0] instanceof Folder).toBe(true);
	});

	it('should give a list of assets and navigation knowledge', async () => {
		const {folders} = await instance.content.getFolders({path: '/'});
		const folder = folders.find(thisFolder => thisFolder.name === "Images") as Folder;
		expect(folder).not.toBeNull();
		const {assets, navigation} = await instance.content.getAssets({path: folder.path});
		expect(assets).not.toBeNull();
		expect(assets.length > 0).toBe(true);
		expect(assets[0] instanceof Asset).toBe(true);
		expect(navigation.total > 0).toBe(true);
	});

	it('should get all assets if not path was provided', async () => {
		const {assets, navigation} = await instance.content.getAssets();
		expect(assets).not.toBeNull();
		expect(assets.length > 0).toBe(true);
		expect(assets[0] instanceof Asset).toBe(true);
		expect(navigation.total > 0).toBe(true);
	});

	it('should allow navigation', async () => {
		const {assets, navigation} = await instance.content.getAssets({
			navigation: {
				page: 1,
				limit: 12,
			},
		});
		const assets1 = assets;
		expect(assets1.length).toBe(12);
		expect(navigation.total > 12).toBe(true);

		const response = await instance.content.getAssets({
			navigation: {
				page: 2,
				limit: 12,
			},
		});

		const assets2 = response.assets;
		expect(assets2.length).toBe(12);
		// Validate that we actually got different assets
		expect(assets1[0].id).not.toBe(assets2[0].id);
	});

	it('should give exactly the amount of assets requested', async () => {
		const {assets} = await instance.content.getAssets({
			navigation: {
				page: 1,
				limit: 15,
			},
		});
		expect(assets.length).toBe(15);
	});

	it('should give a file extension', async () => {
		const {assets} = await instance.content.getAssets();
		expect(assets[0].getFileExtension()).not.toBe("");
	});
});
