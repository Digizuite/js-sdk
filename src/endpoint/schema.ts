import {Endpoint, IEndpointArgs} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {DigiUploader} from '../utilities/digiUploader';
import {Asset} from "../model/asset";
import {MetadataGroup} from "../model/metadata/metadataGroup";
import {MetadataItem} from "../model/metadata/metadataItem";

export interface ISchemaEndpointArgs extends IEndpointArgs {
    computerName: string;
    apiVersion: string;
    instance: ConnectorType;
}

export class Schema extends Endpoint {
    private instance: ConnectorType;
    private digiUpload: DigiUploader;

    /**
     * C-tor
     * @param {Object} args
     * @param {string} args.computerName
     */
    constructor(args: ISchemaEndpointArgs) {
        super(args);
        this.digiUpload = new DigiUploader(args);
        this.instance = args.instance;
    }

    /**
     * Simple method for generating a default json schema starting point
     * Comment: In all honesty i would have liked to chain stuff but not
     * possible when the meta data requires result from assets call....
     * @returns {Promise<{properties: (any & (never | any[]))}>}
     */
    public generateDefaultJsonSchema() {
        return this._getAllAssets()
            .then( (assets) => this._getAllMetaDataGroups(assets))
            .then( propertyList => {

                // Reduce the properties into one object
                var properties = propertyList.reduce( (previousValue, currentValue) => {
                    return Object.assign(previousValue, currentValue);
                });

                // Put in the required format for validation
                var schema = {
                    apiVersion: "4.7.1",
                    description: "This is a schema for Digizuite JavaScript SDK",
                    properties: properties
                };
                this._validateSchema( schema );

                return schema;
            });
    }

    /**
     * Simple wrapper getting all assets
     * @returns {Promise<{assets: Asset[]; navigation: {total: number}}>}
     */
    private _getAllAssets() {
        return this.instance.content.getAssets( { navigation: {
            page : 1,
            limit: 10
        }});
    }

    /**
     * Simple wrapper method for meta data groups
     * @param result
     * @returns {Promise<any[]>}
     */
    private _getAllMetaDataGroups( result: any ) {
        var assets: Asset[] = result.assets;
        var asset: Asset = assets[0];
        return this.instance.metadata.getMetadataGroups( { asset : asset })
            .then( ( groups: MetadataGroup[] ) => this._getMetaDataFromAllGroups( asset, groups ) );
    }

    /**
     * Returning a promise for all meta data from the list of groups
     * @param {Asset} asset
     * @param groups
     * @returns {Promise<[any]>}
     */
    private _getMetaDataFromAllGroups( asset: Asset, groups: any ) {
        return Promise.all(
            groups.map((group: any) => this._getMetadataFromGroup( asset, group )),
        );
    }

    /**
     * Returning meta data for one group
     * @param {Asset} asset
     * @param group
     * @returns {Promise<any>}
     */
    private _getMetadataFromGroup( asset: Asset, group: any) {
        return this.instance.metadata.getMetadataItems({
            asset : asset,
            group : group, // asset info
        }).then( ( items: MetadataItem<any>[] ) => {
            return this._generateSchema( items );
        });
    }

    /**
     * Generating a schema property for the MetaData Item
     * @param {MetadataItem<any>[]} items
     */
    private _generateSchema( items: MetadataItem<any>[] ) {
        var properties: any = {};
        items.forEach( (item: MetadataItem<any>) => {

            var name: string = String(item.name);
            properties[name] = {
                type: "object",
                id: item.guid,
                title: name
            };

        });
        return properties;
    }

    /**
     * Simple compilation and validation of the generated schema.
     * It will error th
     * @param schema
     */
    private _validateSchema( schema: any ) {
        var Ajv = require('ajv');
        var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
        ajv.compile(schema);
    }

}

// Attach endpoint
const name = 'schema';
const getter = function (instance: ConnectorType) {
    return new Schema({
        apiUrl: instance.apiUrl,
        apiVersion: instance.apiVersion,
        computerName: instance.state.config.UploadName,
        instance,
    });
};

attachEndpoint({name, getter});

declare module '../connector' {
    interface Connector {
        schema: Schema;
    }
}
