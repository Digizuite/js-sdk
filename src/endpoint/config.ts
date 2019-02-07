import {Endpoint} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {AppLabels} from '../request/configService/appLabels';
import {AppConfiguration} from '../request/searchService/appConfiguration';
import {SystemVersion} from '../request/searchService/systemVersion';
import {ConnectorConfiguration} from "../request/configService/connectorConfiguration";

export class Config extends Endpoint {

	private cache: {
		labelsPromise?: Promise<any>, // TODO
	};

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args: { apiUrl: string }) {
		super(args);

		this.cache = {};
	}

	/**
	 * Get app configurations
	 * @returns {Promise}
	 */
	public getAppConfiguration() {

		const appConfigRequest = new AppConfiguration({
			apiUrl: this.apiUrl,
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
			});

			this.cache.labelsPromise = appConfigRequest.execute();
		}

		return this.cache.labelsPromise;
	}

}

// Attach endpoint
const name = 'config';
const getter = function (instance: ConnectorType) {
	return new Config({
		apiUrl: instance.apiUrl,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		config: Config;
	}
}
