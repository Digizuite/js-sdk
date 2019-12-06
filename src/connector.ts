import {Endpoint} from "./common/endpoint";
import {IConstants} from "./model/constants";
import {IUserData} from "./request/connectService/createAccessKey";
import {ensureTrailingSeparator} from './utilities/helpers/url';

export interface IConnectorInstanceOptions {
	siteUrl: string;
}

export interface IConnectorState {
	user: IUserData;
	config: any;
	constants: IConstants;
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

		let digizuiteInstance;

		try {
			digizuiteInstance = new Connector({
				siteUrl: args.siteUrl,
			});
		} catch (e) {
			return Promise.reject(e);
		}

		return digizuiteInstance.initializeConnector();
	}

	public readonly siteUrl: string;

	public readonly state: IConnectorState = {
		user: {} as IUserData,
		config: {},
		constants: {} as IConstants,
	};

	public readonly endpoints: { [key: string]: Endpoint } = {};

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args: { siteUrl: string } = { siteUrl: '' }) {

		if (args.siteUrl.length === 0) {
			throw new Error('siteUrl is a required parameter');
		}

		this.siteUrl = ensureTrailingSeparator(args.siteUrl);
	}

	public getConstants(): IConstants {
		return this.state.constants;
	}

	/**
	 * Gets the SSO Login URL
	 */
	public getSSOLoginUrl(callbackUrl: string): string {
		// tslint:disable-next-line:max-line-length
		return `${this.state.constants.loginServiceUrl}?callbackUrl=${callbackUrl}&versionId=${this.state.constants.versionId}`;
	}

	public initializeConnector(): Promise<Connector> {
		return this.constants.getConstants().then<Connector>(constants => {
			this.state.constants = constants;
			return this;
		});
	}

	public connectWithAccessKey(accessKey: string = ''): Promise<Connector> {
		if (accessKey.length === 0) {
			return Promise.reject(new Error('SSO Token is a required parameter'));
		}

		return this.bootstrapConnector(this.auth.getAccessKeyInfo({ accessKey }));
	}

	public connectWithCredentials(username: string = '', password: string = ''): Promise<Connector> {
		if (username.length === 0) {
			return Promise.reject(new Error('Username is a required parameter'));
		}

		if (password.length === 0) {
			return Promise.reject(new Error('Password is a required parameter'));
		}

		return this.bootstrapConnector(this.auth.createAccessKey({ username, password }));
	}

	private getUserData(loginResponse: IUserData): Promise<IUserData> {
		return this.auth.setAccessKeyOptions(
			loginResponse.accessKey,
			{
				versionId: this.state.constants.versionId,
				languageId: loginResponse.languageId,
			},
		).then(accessKeyData => ({
			...loginResponse,
			languageId: accessKeyData.languageId,
			accessKey: accessKeyData.accessKey,
		}));
	}

	private bootstrapConnector(accessKeyPromise: Promise<IUserData>): Promise<Connector> {
		const bootstrapPromise = accessKeyPromise
			.then(loginResponse => this.getUserData(loginResponse))
			.then(userData => this.state.user = userData)
			.then(() => this.config.getAppConfiguration())
			.then(configResponse => this.state.config = configResponse);

		// We don't need this immediately, but we preload it for future use
		bootstrapPromise.then(() => {
			this.config.getAppLabels();
		});

		return bootstrapPromise.then(() => this);
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
