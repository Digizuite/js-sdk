import {Constants, ASSET_TYPE, ASSET_TYPE_REVERSE} from 'const';

describe('Sanity', () => {

    it('should work', () => {
        expect(Constants.GUID.LAST_MODIFIED).toEqual('BF26CA13-BE60-4B34-8087-C7F8345158F7');
    });
});


describe('Constants', () => {
    it('Should have all constants as reverse', () => {
        for (let key in ASSET_TYPE_REVERSE) {
            if (ASSET_TYPE_REVERSE.hasOwnProperty(key)) {
                const value = ASSET_TYPE_REVERSE[key];
                expect(ASSET_TYPE[value] == key).toEqual(true);
            }
        }
    });
});