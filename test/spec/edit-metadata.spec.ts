import {Connector} from "../../src/connector";
import {
	BitMetadataItem,
	ComboOption,
	ComboValueMetadataItem,
	DateTimeMetadataItem,
	EditComboValueMetadataItem,
	EditMultiComboValueMetadataItem,
	FloatMetadataItem,
	IntMetadataItem,
	LinkMetadataItem,
	MoneyMetadataItem,
	MultiComboValueMetadataItem,
	NoteMetadataItem,
	StringMetadataItem,
	TreeMetadataItem,
	UniqueOption,
	UniqueVersionMetadataItem,
} from '../../src/index';
import {Asset} from "../../src/model/asset";
import {MetadataItem} from "../../src/model/metadata/metadataItem";
import {getInstance} from '../test-helpers';

describe('Edit metadata', () => {

	let instance: Connector;

	beforeAll(async () => {
		instance = await getInstance();
	});

	let itemsCache: Array<MetadataItem<any>>;

	let assetsCache: Asset[];

	// Helpers method for getting metadata items for tests
	async function getMetadataItem<T>(type: any, assetIndex = 0): Promise<T> {
		if (!itemsCache) {
			if (!assetsCache) {
				const {assets} = await instance.content.getAssets();
				assetsCache = assets;
			}
			const groups = await instance.metadata.getMetadataGroups({
				asset: assetsCache[assetIndex],
			});

			itemsCache = await instance.metadata.getMetadataItems({
				asset: assetsCache[assetIndex],
				group: groups.filter((group) => group.id === 50047)[0],
			});
		}
		return itemsCache.filter((item: any) => item && item.TYPE === type)[0] as any as T;
	}

	// Helpers function to save a field
	async function saveMetadataItem<T extends MetadataItem<any>>(item: T) {
		return await instance.metadata.updateMetadataItems({
			assets: [assetsCache[0]],
			metadataItems: [item],
		});
	}

	it('should give metadata for an asset', async () => {
		const {assets} = await instance.content.getAssets();
		const groups = await instance.metadata.getMetadataGroups({
			asset: assets[0],
		});

		expect(groups).not.toBeNull();
		expect(groups.length > 0).toBe(true);

		const items = await instance.metadata.getMetadataItems({
			asset: assets[0],
			group: groups[0],
		});

		expect(items).not.toBeNull();
		expect(items.length > 0).toBe(true);
	});

	it('should edit bitMetadataItem field', async () => {
		const field = await getMetadataItem<BitMetadataItem>(BitMetadataItem.TYPE);

		field.setValue(true);
		expect(field.getValue()).toBe(true);

		field.setValue(false);
		expect(field.getValue()).toBe(false);

		await saveMetadataItem(field);
	});

	it('should edit comboValueMetadataItem field', async () => {
		const item = await getMetadataItem<ComboValueMetadataItem>(ComboValueMetadataItem.TYPE);

		const {options} = await instance.metadata.getMetadataItemOptions({
			metadataItem: item,
			navigation: {
				page: 1,
				limit: 12,
			},
		});

		expect(options).not.toBeNull();
		expect(options.length > 0).toBe(true);

		item.setValue(options[0]);
		expect(item.getValue()).toBe(options[0]);

		await saveMetadataItem(item);
	});

	it('should edit dataTimeMetadataItem field', async () => {
		const item = await getMetadataItem<DateTimeMetadataItem>(DateTimeMetadataItem.TYPE);

		const now = new Date();
		item.setValue(now);
		expect(item.getValue()).toBe(now);

		const at = new Date(2017, 5, 20, 11, 5, 0, 0);
		const s = `20-06-2017 11:05:00`;

		item.setValueFromString(s);
		const set = item.getValue()!;
		set.setMilliseconds(0);
		expect(set.getTime()).toBe(at.getTime());

		await saveMetadataItem(item);
	});

	it('should edit editComboValueMetadataItem field', async () => {
		const item = await getMetadataItem<EditComboValueMetadataItem>(EditComboValueMetadataItem.TYPE);

		const value = new ComboOption({
			value: `combo-value-test-${new Date().getTime()}`,
		});

		item.setValue(value);

		await saveMetadataItem(item);
	});

	it('should edit editMultiComboValueMetadataItem field', async () => {
		const item = await getMetadataItem<EditMultiComboValueMetadataItem>(EditMultiComboValueMetadataItem.TYPE);

		const value = new ComboOption({
			value: `combo-value-test-${new Date().getTime()}`,
		});

		item.setValue([value]);

		await saveMetadataItem(item);
	});

	it('should edit floatMetadataItem field', async () => {
		const item = await getMetadataItem<FloatMetadataItem>(FloatMetadataItem.TYPE);

		item.setValue(4);
		expect(item.getValue()).toBe(4);

		item.setValue(5.6);
		expect(item.getValue()).toBe(5.6);

		await saveMetadataItem(item);
	});

	it('should edit intMetadataItem field', async () => {
		const item = await getMetadataItem<IntMetadataItem>(IntMetadataItem.TYPE);

		item.setValue(4);
		expect(item.getValue()).toBe(4);

		item.setValue(3);
		expect(item.getValue()).toBe(3);

		await saveMetadataItem(item);

		expect(() => item.setValue(5.6)).toThrowError();
	});

	it('should edit linkMetadataItem field', async () => {
		const item = await getMetadataItem<LinkMetadataItem>(LinkMetadataItem.TYPE);

		item.setValue('http://zlepper.dk');
		expect(item.getValue()).toBe('http://zlepper.dk');

		item.setValue('http://digizuite.com');
		expect(item.getValue()).toBe('http://digizuite.com');

		await saveMetadataItem(item);

		// expect(() => item.setValue('bla blab abl')).toThrowError();
	});

	it('should edit moneyMetadataItem field', async () => {
		const item = await getMetadataItem<MoneyMetadataItem>(MoneyMetadataItem.TYPE);

		item.setValue("500 KR");
		expect(item.getValue()).toBe("500 KR");

		await saveMetadataItem(item);
	});

	it('should edit multiComboValueMetadataItem field', async () => {
		const item = await getMetadataItem<MultiComboValueMetadataItem>(MultiComboValueMetadataItem.TYPE);

		const {options} = await instance.metadata.getMetadataItemOptions({
			metadataItem: item,
			navigation: {
				page: 1,
				limit: 12,
			},
		});

		item.setValue([options[0]]);
		expect(item.getValue()![0]).toBe(options[0]);

		await saveMetadataItem(item);
	});

	it('should edit noteMetadataItem', async () => {
		const item = await getMetadataItem<NoteMetadataItem>(NoteMetadataItem.TYPE);

		item.setValue('Long text test. Maybe. ');
		expect(item.getValue()).toBe('Long text test. Maybe. ');

		item.setValue('long text 2');
		expect(item.getValue()).toBe('long text 2');

		await saveMetadataItem(item);
	});

	it('should edit stringMetadataItem', async () => {
		const item = await getMetadataItem<StringMetadataItem>(StringMetadataItem.TYPE);

		item.setValue('string text');
		expect(item.getValue()).toBe('string text');

		item.setValue('2');
		expect(item.getValue()).toBe('2');

		await saveMetadataItem(item);
	});

	it('should edit treeMetadataItem field', async () => {
		const item = await getMetadataItem<TreeMetadataItem>(TreeMetadataItem.TYPE);

		const {options} = await instance.metadata.getMetadataItemOptions({
			metadataItem: item,
			navigation: {
				page: 1,
				limit: 12,
			},
		});

		item.setValue([options[0]]);
		expect(item.getValue()![0]).toBe(options[0]);

		item.setValue([]);
		expect(item.getValue()![0]).toBeUndefined();

		await saveMetadataItem(item);
	});

	it('should edit uniqueVersionMetadataItem field', async () => {
		const item = await getMetadataItem<UniqueVersionMetadataItem>(UniqueVersionMetadataItem.TYPE);

		const option = new UniqueOption({
			unique: `${new Date().getTime()}`,
			version: `${new Date().getTime()}`,
		});

		item.setValue(option);
		expect(item.getValue()).toBe(option);

		let isUnique = true;
		try {
			await instance.metadata.verifyUniqueVersion({
				asset: assetsCache[0],
				metadataItem: item,
			});
		} catch (err) {
			isUnique = false;
		}
		expect(isUnique).toBe(true);
	});

	it('should edit metadata on multiple assets', async () => {
		const item1 = await getMetadataItem<StringMetadataItem>(StringMetadataItem.TYPE, 0);
		const item2 = await getMetadataItem<StringMetadataItem>(StringMetadataItem.TYPE, 1);

		item1.setValue('bla');
		item2.setValue('doo');

		await instance.metadata.updateMetadataItems({
			assets: [assetsCache[0], assetsCache[1]],
			metadataItems: [item1, item2],
		});
	});

	it('should copy metadata to multiple assets', async () => {
		const {assets} = await instance.content.getAssets();
		await instance.metadata.copyMetadata({
			sourceAsset: assets[0],
			targetAsset: assets[1],
		});
	});
});
