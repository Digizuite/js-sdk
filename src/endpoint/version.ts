import {attachEndpoint, Connector} from '../connector';
import {Endpoint, IEndpointArgs} from '../common/endpoint';
import {ReplaceTicket} from '../model/ticket/replaceTicket';
import {RestoreTicket} from '../model/ticket/restoreTicket';
import {DigiUploader, DigiUploadFile} from '../utilities/digiUploader';
import {Asset} from '../model/asset';
import {AssetVersion} from '../model/assetVersion';
import {AssetVersions} from '../request/searchService/assetVersions';
import {getLockInformation} from "../utilities/lockInformation";
import {RequestError} from "../common/requestError";

export interface IVersionEndpointArgs extends IEndpointArgs {
    computerName: string;
    apiVersion: string;
}

export class Version extends Endpoint {
    private _digiUpload: DigiUploader;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {string} args.computerName
	 */
    constructor(args: IVersionEndpointArgs) {
		super(args);
		this._digiUpload = new DigiUploader(args);
	}
	
	/**
	 * Returns a promise that resolved to a replace ticket
	 * @param args
	 * @returns {Promise.<ReplaceTicket>}
	 */
    requestReplaceTicket(args: { asset: Asset, file: DigiUploadFile }): Promise<ReplaceTicket> {
		
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
    requestRestoreTicket(args: { asset: Asset, version: AssetVersion }): Promise<RestoreTicket> {
		
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
    replaceAssetByTicket(args: { ticket: ReplaceTicket }): Promise<void> {
		
		if ( !(args.ticket instanceof ReplaceTicket)) {
			throw new Error('Replace expect a replace ticket as parameter');
		}
		
		return getLockInformation({
			asset : args.ticket.asset,
			apiUrl : this.apiUrl
		}).then((lockInfo)=>{

			if( lockInfo.isLocked ) {
				throw new RequestError('Asset is being locked', 6660);
			}return this._digiUpload.uploadFile(args.ticket)
			.then(() => this._digiUpload.finishUpload(args.ticket))
			.then(() => {  });
		});
	}
	
	
	/**
	 * Restore an asset from ticket
	 * @param args
	 * @param {ReplaceTicket} args.ticket
	 * @returns {Promise.<>}
	 */
    restoreAssetByTicket(args: { ticket: ReplaceTicket }): Promise<void> {
		
		if ( !(args.ticket instanceof RestoreTicket)) {
			throw new Error('Restore expect a replace ticket as parameter');
		}
		
		return getLockInformation({
			asset : args.ticket.asset,
			apiUrl : this.apiUrl
		}).then((lockInfo)=> {

			if (lockInfo.isLocked) {
				throw new RequestError('Asset is being locked', 6660);
			}

			return this._digiUpload.finishUpload(args.ticket)
                .then(() => {
                });
		});
		
	}
	
	/**
	 * Get a list of asset versions
	 * @param args
	 * @param {Asset} args.asset
	 * @returns {Promise.<AssetVersion[]>}
	 */
    getAssetVersions(args: { asset: Asset }): Promise<AssetVersion[]> {
		
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

// Attach endpoint
const name   = 'version';
const getter = function (instance: Connector) {
	return new Version({
		apiUrl      : instance.apiUrl,
		//TODO: un-hard-code this when we get a dam version
		apiVersion  : '4.7.1',
		computerName: instance.state.config.UploadName
	});
};

attachEndpoint({name, getter});


declare module '../connector' {
    interface Connector {
        version: Version
    }
}