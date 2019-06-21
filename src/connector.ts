import {Endpoint} from "./common/endpoint";
import {IUserData} from "./request/connectService/createAccessKey";
import {ensureTrailingSeparator} from './utilities/helpers/url';
import Timer = NodeJS.Timer;

export interface IConnectorInstanceOptions {
	apiUrl: string;
	username?: string;
	password?: string;
	accessKey?: string;
}

export class Connector {

	/**
	 * Initialize the connector
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @returns {Promise}.<Connector> - a promise that will be resolved once the
	 */
	public static getConnectorInstance(args: IConnectorInstanceOptions) {

		const digizuiteInstance = new Connector({
			apiUrl: args.apiUrl,
		});
		return digizuiteInstance.initializeConnector({
			username: args.username,
			password: args.password,
			accessKey: args.accessKey,
		});

	}

	/**
	 * Initialize the connector
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @returns {Promise}.<Connector> - a promise that will be resolved once the
	 */
	public static getConfiguration(args: { apiUrl: string}) {

		const digizuiteInstance = new Connector(args);
		return digizuiteInstance.getConnectorConfiguration();

	}

	public apiVersion: string;
	public apiUrl: string;
	public state: { user: any; config: any, keepAliveIntervalTimer?: Timer|number, versionId: string };
	public endpoints: { [key: string]: Endpoint };
	private readonly keepAliveInterval: number;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Number} [args.keepAliveInterval] - Timeout for making a keep alive request
	 */
	constructor(args: { apiUrl: string, keepAliveInterval?: number }) {

		if (typeof args.apiUrl !== 'string' || args.apiUrl.length === 0) {
			throw new Error('apiUrl is a required parameter');
		}

		this.apiUrl = ensureTrailingSeparator(args.apiUrl);
		this.keepAliveInterval = args.keepAliveInterval || 60000;

		this.apiVersion = '';

		this.state = {
			user: {},
			config: {},
			versionId: '',
		};

		this.endpoints = {};

	}

	public initializeConnectorWithCredentials(args: { username: string, password: string }): Promise<IUserData> {

		if (args.username.length === 0) {
			return Promise.reject(new Error('username is a required parameter'));
		}

		if (args.password.length === 0) {
			return Promise.reject(new Error('password is a required parameter'));
		}

		return this.auth.createAccessKey({
			username: args.username as string,
			password: args.password as string,
		});

	}

	/**
	 * Initializes a connector instance. Logs in and fetches the configs
	 * @param {Object} args
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @returns {Promise.<Connector>}
	 */
	public initializeConnector(args: { username?: string, password?: string, accessKey?: string }) {

		let accessKeyPromise;

		if (!!args.username && !!args.password) {
			accessKeyPromise = this.initializeConnectorWithCredentials({ username: args.username, password: args.password });
		} else if (!!args.accessKey) {
			accessKeyPromise = Promise.resolve(args.accessKey);
		} else {
			return Promise.reject(new Error('accessKey or username & password are required'));
		}

		const bootstrapPromise = Promise.all([
			accessKeyPromise,
			this.appConfig.getConnectorConfiguration(),
		]).then(([loginResponse, connectorConfiguration]) => {

			this.state.versionId = connectorConfiguration.versionId;

			return this.auth.setAccessKeyOptions(
				loginResponse.accessKey,
				{
					versionId: connectorConfiguration.versionId,
					languageId: loginResponse.languageId,
				},
			).then(accessKeyData => {
				this.state.user = {
					...loginResponse,
					languageId: accessKeyData.languageId,
					accessKey: accessKeyData.accessKey,
				};
			});
		}).then(() => {
			this._initKeepAlive({
				accessKey: this.state.user.accessKey,
			});
		}).then(() => {

			return Promise.all([
				this.config.getAppConfiguration(),
				this.config.getSystemVersion(),
			]);

		}).then(([configResponse, versionResponse]) => {
			this.state.config = configResponse;
			this.apiVersion = versionResponse.Version;
			return this;
		});

		// We don't need this immediately, but we preload it for future use
		bootstrapPromise.then(() => {
			this.config.getAppLabels();
		});

		return bootstrapPromise;
	}

	public getConnectorConfiguration() {
		return this.config.getConnectorConfiguration();
	}

	/**
	 * Initialize keep alive connection logic
	 * @param {Object} args
	 * @private
	 */
	private _initKeepAlive(args: {accessKey: string}) {

		this.state.keepAliveIntervalTimer = setInterval(() => {

			this.auth.keepAlive({ accessKey: args.accessKey });

		}, this.keepAliveInterval);

	}

}

export const getConnectorInstance = Connector.getConnectorInstance;

export interface IAttachEndpoint<T extends Endpoint> {
	name: string;

	getter(connector: Connector): T;
}

/**
 * Attach a new endpoint to the connector
 */
export function attachEndpoint<T extends Endpoint>({name, getter}: IAttachEndpoint<T>) {

	Object.defineProperty(Connector.prototype, name,
		{
			get(this: Connector) {

				if (!this.endpoints[name]) {
					this.endpoints[name] = getter(this);
				}

				return this.endpoints[name];
			},
		},
	);
}
