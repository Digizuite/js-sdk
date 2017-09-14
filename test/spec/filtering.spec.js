import {getInstance} from '../test-helpers';
import {AssetFreeTextFilter} from "../../src/model/filter/AssetFreeTextFilter";
import {AssetTypeFilter} from "../../src/model/filter/assetTypeFilter";
import {Constants} from "../../src/const";
import {AssetCreatedFilter} from "../../src/model/filter/assetCreatedFilter";

describe('Filtering', () => {
    /**
     * @typeof {Connector}
     */
    let instance;

    beforeAll(async () => {
        instance = await getInstance();
    });

    xit('Should filter for asset text', async () => {

        const assetFreeTextFilter = new AssetFreeTextFilter({
            text: 'moon'
        });
        let {assets} = await instance.content.getAssets({
            filters: [assetFreeTextFilter]
        });
        expect(assets).not.toBeNull();
        expect(assets.length > 0).toBe(true);
    });

    it('should filter for asset type', async () => {

        const assetTypeFilter = new AssetTypeFilter({
            types: [Constants.ASSET_TYPE.IMAGE]
        });
        let {assets} = await instance.content.getAssets({
            filters: [assetTypeFilter]
        });

        expect(assets).not.toBeNull();
        expect(assets.length > 0).toBe(true);
    });

    it('should filter for creation date', async () => {

        const assetCreatedFilter = new AssetCreatedFilter({
            from: 1494720000,
            to: Math.floor(Date.now() / 1000)
        });
        let {assets} = await instance.content.getAssets({
            filters: [assetCreatedFilter]
        });

        expect(assets).not.toBeNull();
        expect(assets.length > 0).toBe(true);
    });

    it('should get a list of filters', async () => {
        let filters = await instance.content.getFilters();
        expect(filters).not.toBeNull();
    })
});