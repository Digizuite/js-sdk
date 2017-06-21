import {getInstance} from 'test-helpers';
import {BitMetadataItem,
    StringMetadataItem,
    NoteMetadataItem,
    EditMultiComboValueMetadataItem,
    TreeMetadataItem,
    LinkMetadataItem,
    ComboValueMetadataItem,
    DateTimeMetadataItem,
    FloatMetadataItem,
    IntMetadataItem,
    MoneyMetadataItem,
    MultiComboValueMetadataItem,
    UniqueVersionMetadataItem,
    EditComboValueMetadataItem,
    ComboOption,
    UniqueOption} from 'index';

describe('Edit metadata', () => {

    let instance;

    beforeAll(async () => {
        instance = await getInstance();
    });

    let itemsCache;

    let assetsCache;

    // Helpers method for getting metadata items for tests
    async function getMetadataItem(type) {
        if(!itemsCache) {
            if(!assetsCache) {
                let {assets} = await instance.content.getAssets();
                assetsCache = assets;
            }
            let groups = await instance.metadata.getMetadataGroups({
                asset: assetsCache[0]
            });

            itemsCache = await instance.metadata.getMetadataItems({
                asset: assetsCache[0],
                group: groups.filter(group => group.id === 50029)[0]
            });
        }
        return itemsCache.filter(item => item && item.TYPE === type)[0];
    }

    // Helpers function to save a field
    async function saveMetadataItem(item) {
        return await instance.metadata.updateMetadataItems({
            assets: [ assetsCache[0] ],
            metadataItems : [ item ]
        });
    }

    it('should give metadata for an asset', async () => {
        let {assets} = await instance.content.getAssets();
        let groups = await instance.metadata.getMetadataGroups({
            asset: assets[0]
        });

        expect(groups).not.toBeNull();
        expect(groups.length > 0).toBe(true);

        let items = await instance.metadata.getMetadataItems({
            asset: assets[0],
            group: groups[0]
        });

        expect(items).not.toBeNull();
        expect(items.length > 0).toBe(true);
    });

    it('should edit bitMetadataItem field', async () => {
        let field = await getMetadataItem(BitMetadataItem.TYPE);

        field.setValue(true);
        expect(field.getValue()).toBe(true);

        field.setValue(false);
        expect(field.getValue()).toBe(false);

        await saveMetadataItem(field);
    });

    it('should edit comboValueMetadataItem field', async () => {
        let item = await getMetadataItem(ComboValueMetadataItem.TYPE);

        let {options} = await instance.metadata.getMetadataItemOptions({
            metadataItem : item,
            navigation: {
                page : 1,
                limit: 12
            }
        });

        expect(options).not.toBeNull();
        expect(options.length > 0).toBe(true);

        item.setValue(options[0]);
        expect(item.getValue()).toBe(options[0]);

        await saveMetadataItem(item);
    });

    it('should edit dataTimeMetadataItem field', async () => {
        let item = await getMetadataItem(DateTimeMetadataItem.TYPE);

        const now = new Date();
        item.setValue(now);
        expect(item.getValue()).toBe(now);

        const at = new Date(2017, 5, 20, 11, 5, 0, 0);
        const s = `20-06-2017 11:05:00`;

        item.setValueFromString(s);
        let set = item.getValue();
        set.setMilliseconds(0);
        expect(set.getTime()).toBe(at.getTime());

        await saveMetadataItem(item);
    });

    it('should edit editComboValueMetadataItem field', async () => {
        let item = await getMetadataItem(EditComboValueMetadataItem.TYPE);

        let value = new ComboOption({
            value: 'combo-value-test-' + new Date().getTime()
        });

        item.setValue(value);

        await saveMetadataItem(item)
    });

    it('should edit editMultiComboValueMetadataItem field', async () => {
        let item = await getMetadataItem(EditMultiComboValueMetadataItem.TYPE);


        let value = new ComboOption({
            value: 'combo-value-test-' + new Date().getTime()
        });

        item.setValue([value]);

        await saveMetadataItem(item);
    });

    it('should edit floatMetadataItem field', async () => {
        let item = await getMetadataItem(FloatMetadataItem.TYPE);

        item.setValue(5.6);
        expect(item.getValue()).toBe(5.6);

        item.setValue(4);
        expect(item.getValue()).toBe(4);

        await saveMetadataItem(item);
    });

    it('should edit intMetadataItem field', async () => {
        let item = await getMetadataItem(IntMetadataItem.TYPE);

        item.setValue(4);
        expect(item.getValue()).toBe(4);

        item.setValue(3);
        expect(item.getValue()).toBe(3);

        await saveMetadataItem(item);

        expect(() => item.setValue(5.6)).toThrowError();
    });

    it('should edit linkMetadataItem field', async () => {
        let item = await getMetadataItem(LinkMetadataItem.TYPE);

        item.setValue('http://zlepper.dk');
        expect(item.getValue()).toBe('http://zlepper.dk');

        item.setValue('http://digizuite.com');
        expect(item.getValue()).toBe('http://digizuite.com');

        await saveMetadataItem(item);

        // expect(() => item.setValue('bla blab abl')).toThrowError();
    });

    it('should edit moneyMetadataItem field', async () => {
        let item = await getMetadataItem(MoneyMetadataItem.TYPE);

        item.setValue("500 KR");
        expect(item.getValue()).toBe("500 KR");

        await saveMetadataItem(item);
    });

    it('should edit multiComboValueMetadataItem field', async () => {
        let item = await getMetadataItem(MultiComboValueMetadataItem.TYPE);

        let {options} = await instance.metadata.getMetadataItemOptions({
            metadataItem : item,
            navigation: {
                page : 1,
                limit: 12
            }
        });

        item.setValue([options[0]]);
        expect(item.getValue()[0]).toBe(options[0]);

        await saveMetadataItem(item);
    });

    it('should edit noteMetadataItem', async () => {
        let item = await getMetadataItem(NoteMetadataItem.TYPE);

        item.setValue('Long text test. Maybe. ');
        expect(item.getValue()).toBe('Long text test. Maybe. ');

        item.setValue('long text 2');
        expect(item.getValue()).toBe('long text 2');

        await saveMetadataItem(item);
    });

    it('should edit stringMetadataItem', async () => {
        let item = await getMetadataItem(StringMetadataItem.TYPE);

        item.setValue('string text');
        expect(item.getValue()).toBe('string text');

        item.setValue('2');
        expect(item.getValue()).toBe('2');

        await saveMetadataItem(item);
    });

    it('should edit treeMetadataItem field', async () => {
        let item = await getMetadataItem(TreeMetadataItem.TYPE);

        let {options} = await instance.metadata.getMetadataItemOptions({
            metadataItem : item,
            navigation: {
                page : 1,
                limit: 12
            }
        });

        item.setValue([options[0]]);
        expect(item.getValue()[0]).toBe(options[0]);

        item.setValue([]);
        expect(item.getValue()[0]).toBeUndefined();

        await saveMetadataItem(item);
    });

    it('should edit uniqueVersionMetadataItem field', async () => {
        let item = await getMetadataItem(UniqueVersionMetadataItem.TYPE);

        let option = new UniqueOption({
            unique : `${new Date().getTime()}`,
            version : `${new Date().getTime()}`
        });

        item.setValue(option);
        expect(item.getValue()).toBe(option);

        let isUnique = true;
        try {
            await instance.metadata.verifyUniqueVersion({
                asset: assetsCache[0],
                metadataItem: item
            });
        } catch(err) {
            console.log(err);
            isUnique = false;
        }
        expect(isUnique).toBe(true)
    });
});