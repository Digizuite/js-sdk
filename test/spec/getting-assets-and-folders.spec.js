import {getInstance} from 'test-helpers';
import {Folder} from "model/folder";
import {Asset} from 'model/asset'

describe('Getting assets and folders', () => {
    /**
     * @typeof {Connector}
     */
    let instance;

    beforeAll(async () => {
        instance = await getInstance();
    });

    it('should give a list of folders', async () => {
        let {folders} = await instance.content.getFolders({path: '/'});
        expect(folders).not.toBeNull();
        expect(folders[0] instanceof Folder).toBe(true);
    });

    it('should give a list of assets and navigation knowledge', async () => {
        let {assets, navigation} = await instance.content.getAssets({path: '/33/'});
        expect(assets).not.toBeNull();
        expect(assets.length > 0).toBe(true);
        expect(assets[0] instanceof Asset).toBe(true);
        expect(navigation.total > 0).toBe(true);
    });

    it('should get all assets if not path was provided', async () => {
        let {assets, navigation} = await instance.content.getAssets();
        expect(assets).not.toBeNull();
        expect(assets.length > 0).toBe(true);
        expect(assets[0] instanceof Asset).toBe(true);
        expect(navigation.total > 0).toBe(true);
    });

    it('should allow navigation', async () => {
        let {assets, navigation} = await instance.content.getAssets({
            navigation: {
                page: 1,
                limit: 12
            }
        });
        const assets1 = assets;
        expect(assets1.length).toBe(12);
        expect(navigation.total > 12).toBe(true);

        ({assets} = await instance.content.getAssets({
            navigation: {
                page: 2,
                limit: 12
            }
        }));
        const assets2 = assets;
        expect(assets2.length).toBe(12);
        // Validate that we actually got different assets
        expect(assets1[0].id).not.toBe(assets2[0].id);
    });


    it('should give exactly the amount of assets requested', async () => {
        let {assets} = await instance.content.getAssets({
            navigation: {
                page: 1,
                limit: 15
            }
        });
        expect(assets.length).toBe(15);
    });
});