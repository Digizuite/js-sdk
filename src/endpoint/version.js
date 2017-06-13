import {Endpoint} from 'common/endpoint';
import {ReplaceTicket} from 'model/ticket/replaceTicket';
import {RestoreTicket} from 'model/ticket/restoreTicket';
import {DigiUploader} from 'utilities/digizuite/digiUploader';
import {Asset} from 'model/asset';
import {AssetVersion} from 'model/assetVersion';
import {AssetVersions} from 'request/searchService/assetVersions';

export class Version extends Endpoint {

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {string} args.computerName
	 */
	constructor(args = {}) {
		super(args);
		this._digiUpload = new DigiUploader(args);
	}
	
	/**
	 * Returns a promise that resolved to a replace ticket
	 * @param args
	 * @returns {Promise.<ReplaceTicket>}
	 */
	requestReplaceTicket(args = {}) {
		
		if( !(args.asset instanceof Asset) ) {
			throw new Error('Replace expect an asset as parameter');
		}
		
		return this._digiUpload.getUploadIds({ file : args.file })
			.then((result) => {
				return new ReplaceTicket({
					uploadId: result.uploadId,
					itemId  : result.itemId,
					file    : args.file,
					asset   : args.asset
				});
			});
			
	}
	
	/**
	 * Returns a promise that resolved to a restore ticket
	 * @param args
	 * @param {Asset} args.asset
	 * @param {AssetVersion} args.version
	 * @returns {Promise.<RestoreTicket>}
	 */
	requestRestoreTicket( args = {} ) {
		
		if( !(args.asset instanceof Asset) ) {
			throw new Error('Restore expect an asset as parameter');
		}
		
		if( !(args.version instanceof AssetVersion) ) {
			throw new Error('Restore expect an asset version as parameter');
		}
		
		return this._digiUpload.getUploadIds({
			filename: args.version.getFilename(),
			name    : args.asset.name
		}).then((result) => {
			return new RestoreTicket({
				uploadId: result.uploadId,
				itemId  : result.itemId,
				version : args.version,
				asset   : args.asset
			});
		});
		
	}
	
	/**
	 * Replace asset from ticket
	 * @param args
	 * @param {ReplaceTicket} args.ticket
	 * @returns {Promise.<>}
	 */
	replaceAssetByTicket( args = {} ) {
		
		if ( !(args.ticket instanceof ReplaceTicket)) {
			throw new Error('Replace expect a replace ticket as parameter');
		}
		
		return this._digiUpload.uploadFile(args.ticket)
			.then(() => this._digiUpload.finishUpload(args.ticket))
			.then(() => { return {}; });
		
	}
	
	
	/**
	 * Restore an asset from ticket
	 * @param args
	 * @param {ReplaceTicket} args.ticket
	 * @returns {Promise.<>}
	 */
	restoreAssetByTicket( args = {} ) {
		
		if ( !(args.ticket instanceof RestoreTicket)) {
			throw new Error('Restore expect a replace ticket as parameter');
		}
		
		return this._digiUpload.finishUpload(args.ticket)
			.then(()=> { return {}; });
		
	}
	
	/**
	 * Get a list of asset versions
	 * @param args
	 * @param {Asset} args.asset
	 * @returns {Promise.<AssetVersion[]>}
	 */
	getAssetVersions( args = {} ) {
		
		if( !(args.asset instanceof Asset) ) {
			throw new Error('getAssetVersions expect an asset as parameter');
		}
		
		const assetVersionsRequest = new AssetVersions({
			apiUrl : this.apiUrl
		});
		
		return assetVersionsRequest.execute({
			asset : args.asset
		});
	}
	
}