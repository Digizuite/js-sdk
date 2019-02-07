import {Endpoint} from "./common/endpoint";
import {ensureTrailingSeparator} from './utilities/helpers/url';

export class Connector {
	public apiVersion: string;
	public apiUrl: string;
	public state: { user: any; config: any, keepAliveInterval?: number };
	public endpoints: { [key: string]: Endpoint };

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
		};

		this.endpoints = {};

	}

	private keepAliveInterval: number;

	/**
	 * Initialize the connector
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @returns {Promise}.<Connector> - a promise that will be resolved once the
	 */
	public static getConnectorInstance(args: { apiUrl: string, username: string, password: string }) {

		const digizuiteInstance = new Connector(args);
		return digizuiteInstance.initializeConnector({
			username: args.username,
			password: args.password,
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

	/**
	 * Initializes a connector instance. Logs in and fetches the configs
	 * @param {Object} args
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @returns {Promise.<Connector>}
	 */
	public initializeConnector(args: { username: string, password: string }) {

		if (typeof args.username !== 'string' || args.username.length === 0) {
			return Promise.reject(new Error('username is a required parameter'));
		}

		if (typeof args.password !== 'string' || args.password.length === 0) {
			return Promise.reject(new Error('password is a required parameter'));
		}

		const bootstrapPromise = this.auth.login({
			username: args.username,
			password: args.password,
		}).then((loginResponse) => {
			this.state.user = loginResponse;
			this._initKeepAlive({
				username: args.username,
				password: args.password,
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
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 */
	private _initKeepAlive(args: { username: string, password: string }) {

		this.state.keepAliveInterval = setInterval(() => {

			this.auth.keepAlive()
				.then((response) => {
					if (!response.isLoggedIn) {
						this.auth.login({
							username: args.username,
							password: args.password,
						});
					}
				})
				.catch(() => {
					this.auth.login({
						username: args.username,
						password: args.password,
					});
				});

		}, this.keepAliveInterval) as any as number;

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
