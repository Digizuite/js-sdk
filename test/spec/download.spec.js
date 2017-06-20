import {getInstance} from 'test-helpers';
import {DOWNLOAD_QUALITY} from 'index';

describe('Downloading', () => {

    let instance;

    beforeAll(async () => {
        instance = await getInstance();
    });

    it('should give a download url', async () => {

        let {assets} = await instance.content.getAssets();

        let url = await instance.download.getDownloadURL({
            asset : assets[0],
            quality : DOWNLOAD_QUALITY.ORIGINAL
        });
        expect(!!url).toBe(true);
    });

    it('should give all possible download qualities', async () => {
        let {assets} = await instance.content.getAssets();

        let qualities = await instance.download.getAllDownloadURL({
            asset : assets[0],
        });

        expect(qualities).not.toBeNull();
        expect(qualities.length > 0).toBe(true);
    });
});