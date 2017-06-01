import {Endpoint} from 'common/endpoint';
import {MetadataGroups} from 'request/metadataService/metadataGroups';
import {MetadataItems} from 'request/metadataService/metadataItems';
import {ComboOptions} from 'request/metadataService/comboOptions';
import {TreeOptions} from 'request/metadataService/treeOptions';
import {IsUniqueVersion} from 'request/metadataService/isUniqueVersion';
import {BatchUpdate} from 'request/batchUpdateService/batchUpdate';
import {LanguageMetadataGroup} from 'model/metadata/languageMetadataGroup';
import {TreeMetadataItem} from'model/metadata/treeMetadataItem';
import {ComboValueMetadataItem} from'model/metadata/comboValueMetadataItem';
import {EditComboValueMetadataItem} from'model/metadata/editComboValueMetadataItem';
import {MultiComboValueMetadataItem} from'model/metadata/multiComboValueMetadataItem';
import {EditMultiComboValueMetadataItem} from'model/metadata/editMultiComboValueMetadataItem';

export class Metadata extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {}  ) {
		super(args);
		this.language = args.language;
		this.languages = args.languages;
	}
	
	/**
	 * Returns a list of metadata groups
	 * @param {Object} args
	 * @param {Asset} args.asset - Asset for which to get the metadata
	 */
	getMetadataGroups( args = {} ) {
		
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
	getLanguageMetadataGroups() {
		
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
	getMetadataItems( args = {}) {
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
	 * @param {Asset} args.asset
	 * @param {Array} args.metadataItems
	 * @returns {Promise.<T>}
	 */
	updateMetadataItems( args = {} ) {
		
		if (!args.asset) {
			throw new Error('updateMetadataItems expected an asset as parameter!');
		}
		
		if (!args.metadataItems) {
			throw new Error('updateMetadataItems expected an metadataItems as parameter!');
		}
		
		const batchUpdateRequest = new BatchUpdate({
			apiUrl : this.apiUrl,
		});
		
		return batchUpdateRequest.execute({
			asset        : args.asset,
			metadataItems: args.metadataItems,
		});
	}
	
	/**
	 * Get metadata options
	 * @param args
	 */
	getMetadataItemOptions( args = {} ) {
		
		if( args.metadataItem instanceof TreeMetadataItem ) {
			
			return this.getTreeOptions(args);
			
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
	getTreeOptions( args = {} ) {
		
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
	getComboOptions( args = {} ) {
		
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
	verifyUniqueVersion( args = {} ) {
		
		if (!args.asset) {
			throw new Error('verifyUniqueVersion expected an asset as parameter!');
		}
		
		if (!args.metadataItem) {
			throw new Error('verifyUniqueVersion expected an metadataItem as parameter!');
		}
		
		const isUniqueVersionRequest = new IsUniqueVersion({
			apiUrl : this.apiUrl,
		});
		
		return isUniqueVersionRequest.execute({
			metadataItem: args.metadataItem,
			asset: args.asset
		});
	}
	
}