import {attachEndpoint, Connector} from '../connector';
import {Endpoint, IEndpointArgs} from '../common/endpoint';
import {MetadataGroups} from '../request/metadataService/metadataGroups';
import {MetadataItems} from '../request/metadataService/metadataItems';
import {ComboOptions} from '../request/metadataService/comboOptions';
import {TreeOptions} from '../request/metadataService/treeOptions';
import {IsUniqueVersion} from '../request/metadataService/isUniqueVersion';
import {BatchUpdate} from '../request/batchUpdateService/batchUpdate';
import {LanguageMetadataGroup} from '../model/metadata/languageMetadataGroup';
import {TreeMetadataItem} from '../model/metadata/treeMetadataItem';
import {ComboValueMetadataItem} from '../model/metadata/comboValueMetadataItem';
import {EditComboValueMetadataItem} from '../model/metadata/editComboValueMetadataItem';
import {MultiComboValueMetadataItem} from '../model/metadata/multiComboValueMetadataItem';
import {EditMultiComboValueMetadataItem} from '../model/metadata/editMultiComboValueMetadataItem';
import {DateTimeMetadataItem} from '../model/metadata/dateTimeMetadataItem';
import {UpdateContainer} from '../utilities/updateContainer';
import {MetadataItem} from '../model/metadata/metadataItem';
import {Constants} from '../const';
import {Asset} from "../model/asset";
import {UniqueVersionMetadataItem} from "../model/metadata/uniqueVersionMetadataItem";
import {getLockInformation} from "../utilities/lockInformation";
import {RequestError} from "../common/requestError";
import {CopyMetadata} from "../request/metadataService/copyMetadata";

export interface ILanguage {

    languageId: number;
    languageName: string;
}

export interface IMetadataArgs extends IEndpointArgs {
    language: ILanguage;
    languages: ILanguage[];
}
export class Metadata extends Endpoint {
    private language: ILanguage;
    private languages: ILanguage[];

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
    constructor(args: IMetadataArgs) {
		super(args);
		this.language = args.language;
		this.languages = args.languages;
	}

	/**
	 * Returns a list of metadata groups
	 * @param {Object} args
	 * @param {Asset} args.asset - Asset for which to get the metadata
	 */
    getMetadataGroups(args: { asset: Asset }) {

		if (!args.asset) {
			throw new Error('getMetadataGroups expected an asset as parameter!');
		}

		const groupRequest = new MetadataGroups({
			apiUrl : this.apiUrl,
		});

		// Add this.getLanguageMetadataGroups()
		// for language specific metadata. Beware of not being completed.
		return Promise.all([
			groupRequest.execute({ assetId : args.asset.id }),
			Promise.resolve([]),
		]).then(([metadataGroups, languageGroups]) => {

			const groups = [ ...languageGroups, ...metadataGroups ];

			groups.sort((a, b) => {
				return a.sortIndex - b.sortIndex;
			});

			return groups;
		});
	}

	/**
	 * Returns a list of language metadata
	 * @returns {Promise.<Array>}
	 */
    getLanguageMetadataGroups(): Promise<Array<LanguageMetadataGroup>> {

		const groups = this.languages.map((thisLanguage) => {
			return new LanguageMetadataGroup({
				id        : thisLanguage.languageId,
				languageId: thisLanguage.languageId,
				name      : thisLanguage.languageName,
				sortIndex : Infinity
			});
		});

		return Promise.resolve(groups);
	}

	/**
	 * Returns a list of metadata items in a group
	 * @param args
	 * @param {Asset} args.asset
	 * @param {MetadataGroup} args.group
	 * @returns {Promise.<T>}
	 */
    getMetadataItems(args: { asset: { id: number }, group: { id: number } }) {
		if (!args.asset) {
			throw new Error('getMetadataItems expected an asset as parameter!');
		}

		if (!args.group) {
			throw new Error('getMetadataItems expected an group as parameter!');
		}

		const metadataItemsRequest = new MetadataItems({
			apiUrl : this.apiUrl,
		});

		return metadataItemsRequest.execute({
			id      : args.group.id,
			assetId : args.asset.id,
			language: this.language
		});
	}

	/**
	 *
	 * @param args
	 * @param {Asset[]} args.assets
	 * @param {Array} args.metadataItems
	 * @returns {Promise.<T>}
	 */
    updateMetadataItems(args: { assets: Asset[], metadataItems: Array<MetadataItem<any>> }) {

		if (
			!args.hasOwnProperty('assets') ||
			!Array.isArray(args.assets) ||
			!args.assets.length
		) {
			throw new Error('updateMetadataItems expected an array of assets as parameter!');
		}

		if (
			!args.hasOwnProperty('metadataItems') ||
			!Array.isArray(args.metadataItems) ||
			!args.metadataItems.length
		) {
			throw new Error('updateMetadataItems expected an metadataItems as parameter!');
		}

        // Create a batch
		const metadataItems = [ ...args.metadataItems, this._getLastModifiedMetadataItem() ];

        // Create an update batch
        const updateContainer = new UpdateContainer(<any>{
			type   : UpdateContainer.CONTAINER_TYPE.ItemIdsValuesRowid,
			itemIds: args.assets.map( thisAsset => thisAsset.id ),
			rowId  : UpdateContainer.ROW_ID.NonIncremental
		});

        // Compose all the metadata items into a batch
		metadataItems.forEach(
			thisMetadataItem => updateContainer.addItem( this._getUpdateContainerItemFromMetadataItem(thisMetadataItem) )
		);

        const batchUpdateRequest = new BatchUpdate({
			apiUrl : this.apiUrl,
		});
		return Promise.all(
			args.assets.map( (thisAsset) => getLockInformation({ asset : thisAsset, apiUrl: this.apiUrl }) )
		).then((lockInfo) => {

			const isLocked = lockInfo.reduce( (acc, thisLock) => acc || thisLock.isLocked, false);

			if( isLocked ) {
				throw new RequestError('One or more assets is being locked', 6660);
			}
		return batchUpdateRequest.execute({
			containers : [ updateContainer ]});
		});


	}

    /**
	 * Get metadata options
	 * @param args
	 */
    getMetadataItemOptions(args: { metadataItem: MetadataItem<any>, path?: string }) {

		if( args.metadataItem instanceof TreeMetadataItem ) {

            return this.getTreeOptions(<any>args);

		} else if(
			(args.metadataItem instanceof ComboValueMetadataItem) ||
			(args.metadataItem instanceof EditComboValueMetadataItem) ||
			(args.metadataItem instanceof MultiComboValueMetadataItem) ||
			(args.metadataItem instanceof EditMultiComboValueMetadataItem)
		) {

            return this.getComboOptions(args);

        } else {
			throw new Error('getMetadataItemOptions required a metadata item of type tree or combo value');
		}

    }

	/**
	 * Get tree options
	 * @param args
	 * @returns {Promise}
	 */
    getTreeOptions(args: { metadataItem: TreeMetadataItem, path: string }) {

		if (!args.metadataItem) {
			throw new Error('updateMetadataItem expected an metadataItems as parameter!');
		}

        const treeOptionsRequest = new TreeOptions({
			apiUrl : this.apiUrl,
		});

        return treeOptionsRequest.execute({
			metadataItem: args.metadataItem,
			path: args.path,
		});
	}

    /**
	 * Get combo options
	 * @param args
	 * @returns {Promise}
	 */
    getComboOptions(args: any) {

		if (!args.metadataItem) {
			throw new Error('updateMetadataItem expected an metadataItems as parameter!');
		}

        const comboOptionsRequest = new ComboOptions({
			apiUrl : this.apiUrl,
		});

        return comboOptionsRequest.execute({
			metadataItem: args.metadataItem,
			query: args.query,
		});

    }

	/**
	 * Checks if a version is unique
	 * @param args
	 * @param {Asset} args.asset
	 * @param {UniqueVersionMetadataItem} args.metadataItem
	 * @returns {Promise}
	 */
    verifyUniqueVersion(args: { asset: Asset, metadataItem: UniqueVersionMetadataItem }) {

		if (!args.asset) {
			throw new Error('verifyUniqueVersion expected an asset as parameter!');
		}

        if (!args.metadataItem) {
			throw new Error('verifyUniqueVersion expected an metadataItem as parameter!');
		}

        if (!args.metadataItem.getValue()) {
			throw new Error('verifyUniqueVersion expected an metadataItem  with a value set!');
		}

        if (!args.metadataItem.getValue()!.version || !args.metadataItem.getValue()!.unique) {
			throw new Error('verifyUniqueVersion expected an metadataItem  with a value set!');
		}

        const isUniqueVersionRequest = new IsUniqueVersion({
			apiUrl : this.apiUrl,
		});

        return isUniqueVersionRequest.execute({
			metadataItem: args.metadataItem,
			asset: args.asset
		});
	}

    /**
	 *
	 * @param args
	 * @param {Asset} args.sourceAsset
	 * @param {Asset} args.targetAsset
	 * @returns {Promise}
	 */
    copyMetadata(args: { sourceAsset: Asset, targetAsset: Asset }) {

		if (!args.sourceAsset) {
			throw new Error('copyMetadata expected a sourceAsset as parameter!');
		}

		if (!args.targetAsset) {
			throw new Error('copyMetadata expected a targetAsset as parameter!');
		}

		const copyMetadataRequest = new CopyMetadata({
			apiUrl : this.apiUrl,
		});

		return copyMetadataRequest.execute({
			sourceAsset: args.sourceAsset,
			targetAsset: args.targetAsset
		});
	}

	/**
	 * Creates a last modified metadata items
	 * @returns {DateTimeMetadataItem}
	 */
	_getLastModifiedMetadataItem() {
		return new DateTimeMetadataItem({
			guid : Constants.GUID.LAST_MODIFIED,
			value : new Date()
		});
	}

    /**
	 * Computes a batch value from the metadata item
	 * @param metadataItem
	 * @returns {{fieldName: string, fieldProperties: {}, valueType: (*|{String: number, Bool: number, Int: number, DateTime: number, Float: number, IntList: number, Folder: number, AssetType: number, StringRow: number, BoolRow: number, IntRow: number, DateTimeRow: number, FloatRow: number, IntListRow: number, Delete: number, ValueExtraValue: number, StringList: number, StringListRow: number}), value: (string|null)}}
	 */
    _getUpdateContainerItemFromMetadataItem(metadataItem: any) {

		const updateItem = {
			// Update the metafield with the given labelId
			fieldName      : metadataItem instanceof MetadataItem ? 'metafield' : '',
            fieldProperties: {
                labelId: 0,
                standardGuid: ''
            },

			// Store the value
			valueType: metadataItem.VALUE_TYPE,
			value    : metadataItem.getUpdateValue()
		};

        // Determine if we should use labelId or GUID
		if( metadataItem.labelId ) {
			updateItem.fieldProperties.labelId = metadataItem.labelId;
		} else if( metadataItem.guid ) {
			updateItem.fieldProperties.standardGuid = metadataItem.guid;
		}

        return updateItem;
	}

}

// Attach endpoint
const name   = 'metadata';
const getter = function (instance: Connector) {
	return new Metadata({
		apiUrl   : instance.apiUrl,
		language : instance.state.user.languageId,
		languages: instance.state.config.languages
	});
};

attachEndpoint({ name, getter });


declare module '../connector' {
    interface Connector {
        metadata: Metadata
    }
}