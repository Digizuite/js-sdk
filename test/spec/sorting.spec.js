import {getInstance} from "../test-helpers";
import {SORT_BY, SORT_DIRECTION} from 'const';

describe('Sorting', () => {
    /**
     * @typeof {Connector}
     */
    let instance;

    beforeAll(async () => {
        instance = await getInstance();
    });

    it('Should give assets sorted descending', async () => {
        let {assets} = await instance.content.getAssets({
            sorting: {
                by: SORT_BY.DATE,
                direction: SORT_DIRECTION.DESCENDING
            }
        });

        for(let i = 1; i < assets.length; i++) {
            let asset1 = assets[i - 1].date;
            let asset2 = assets[i].date;
            asset1.setMilliseconds(0);
            asset2.setMilliseconds(0);
            
            expect(asset1.getTime() >= asset2.getTime()).toBe(true, "Assets was not sorted correctly");
        }
    });

    it('should give assets sorted ascended', async () => {
        let {assets} = await instance.content.getAssets({
            sorting: {
                by: SORT_BY.DATE,
                direction: SORT_DIRECTION.ASCENDING
            }
        });

        for(let i = 1; i < assets.length; i++) {
            let asset1 = assets[i - 1].date;
            let asset2 = assets[i].date;
            asset1.setMilliseconds(0);
            asset2.setMilliseconds(0);
            expect(asset1.getTime() <= asset2.getTime()).toBe(true, "Assets was not sorted correctly");
        }
    });

    it('should sort advanced', async () => {
        const sortCriteriaAvailable = instance.content.getSortBy();

        let {assets} = await instance.content.getAssets({
            sorting : {
                by       : sortCriteriaAvailable[0].by,
                direction: SORT_DIRECTION.ASCENDING
            }
        });
        expect(assets).not.toBeNull();
        expect(assets.length > 0).toBe(true);
    });
});