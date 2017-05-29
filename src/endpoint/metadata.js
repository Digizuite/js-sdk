import {Endpoint} from 'common/endpoint';
import {MetadataGroups} from 'request/metadataService/metadataGroups';
import {MetadataItems} from 'request/metadataService/metadataItems';
import {LanguageMetadataGroup} from 'model/metadata/languageMetadataGroup';

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
		
		return Promise.all([
			groupRequest.execute({ assetId : args.asset.id }),
			this.getLanguageMetadataGroups()
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
	 * @param {array} args.metadataItems
	 * @returns {Promise.<T>}
	 */
	updateMetadataItems( args = {} ) {
		
		if (!args.asset) {
			throw new Error('updateMetadataItems expected an asset as parameter!');
		}
		
		if (!args.metadataItems) {
			throw new Error('updateMetadataItems expected an metadataItems as parameter!');
		}
		
		debugger;
		
		return Promise.resolve();
	}
	
}