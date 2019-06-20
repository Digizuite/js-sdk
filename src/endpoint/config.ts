import {Endpoint, IEndpointArgs} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {AppLabels} from '../request/configService/appLabels';
import {ConnectorConfiguration} from "../request/configService/connectorConfiguration";
import {AppConfiguration} from '../request/searchService/appConfiguration';
import {SystemVersion} from '../request/searchService/systemVersion';

export interface IConfigEndpointArgs extends IEndpointArgs {
	languageId?: number;
	versionId?: string;
}

export class Config extends Endpoint {

	private cache: {
		labelsPromise?: Promise<any>, // TODO
	};

	private readonly languageId: number;
	private readonly versionId: string;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args: IConfigEndpointArgs) {
		super(args);

		this.cache = {};

		if (args.languageId) {
			this.languageId = args.languageId;
		}

		if (args.versionId) {
			this.versionId = args.versionId;
		}
	}

	/**
	 * Get app configurations
	 * @returns {Promise}
	 */
	public getAppConfiguration() {

		const appConfigRequest = new AppConfiguration({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return appConfigRequest.execute();
	}

	public getConnectorConfiguration() {
		const connectorConfigRequest = new ConnectorConfiguration({
			apiUrl: this.apiUrl,
		});

		return connectorConfigRequest.execute();
	}

	/**
	 * Get system version
	 *
	 * @returns {Promise}
	 */
	public getSystemVersion() {

		const systemVersionRequest = new SystemVersion({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return systemVersionRequest.execute();
	}

	/**
	 * Get app labels
	 * @returns {Promise}
	 */
	public getAppLabels() {

		if (!this.cache.labelsPromise) {

			const appConfigRequest = new AppLabels({
				apiUrl: this.apiUrl,
				accessKey: this.accessKey,
			});

			this.cache.labelsPromise = appConfigRequest.execute({
				languageId: this.languageId,
				versionId: this.versionId,
			});
		}

		return this.cache.labelsPromise;
	}

}

// Attach AppConfig endpoint
const appConfigName = 'appConfig';
const appConfigGetter = function (instance: ConnectorType) {
	return new Config({
		apiUrl: instance.apiUrl,
	});
};

attachEndpoint({name: appConfigName, getter: appConfigGetter});

// Attach Config endpoint
const name = 'config';
const getter = function (instance: ConnectorType) {
	return new Config({
		apiUrl: instance.apiUrl,
		accessKey: instance.state.user.accessKey,
		languageId: instance.state.user.languageId,
		versionId: instance.state.versionId,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		config: Config;
		appConfig: Config;
	}
}
