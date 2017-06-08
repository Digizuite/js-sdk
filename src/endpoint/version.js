import {Endpoint} from 'common/endpoint';
import {ReplaceTicket} from 'model/ticket/replaceTicket';
import {DigiUploader} from 'utilities/digizuite/digiUploader';
import {Asset} from 'model/asset';
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
		
		return this._digiUpload.getUploadId(args.file)
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
	 * Upload assets from upload tickets
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
	 * Get a list of asset versions
	 * @param args
	 * @returns {Promise}
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