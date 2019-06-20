import {Endpoint} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {CreateAccessKey, IUserData} from "../request/connectService/createAccessKey";
import {KeepAlive} from '../request/connectService/keepAlive';
import {IAccessKeyData, SetAccessKeyOptions} from "../request/connectService/setAccessKeyOptions";

export interface IAuthEndpointArgs {
	apiUrl: string;
	keepAliveInterval?: number;
}

export class Auth extends Endpoint {
	private keepAliveInterval: number;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Number} [args.keepAliveInterval] - Timeout for making a keep alive request
	 */
	constructor(args: IAuthEndpointArgs) {
		super(args);
		this.keepAliveInterval = args.keepAliveInterval || 60000;
	}

	/**
	 * Logs in a user
	 * @param {String} username - username to log in with
	 * @param {String} password - password of said user
	 * @returns {Promise}
	 */
	public createAccessKey({username = '', password = ''}): Promise<IUserData> {

		const loginRequest = new CreateAccessKey({
			apiUrl: this.apiUrl,
		});

		return loginRequest.execute({
			username, password,
		});

	}

	/**
	 *
	 * @param accessKey
	 * @param args
	 */
	public setAccessKeyOptions(
		accessKey: string,
		args: { versionId: string, languageId: number },
	): Promise<IAccessKeyData> {

		const optionsRequest = new SetAccessKeyOptions({
			apiUrl: this.apiUrl,
		});

		return optionsRequest.execute({
			accessKey,
			versionId: args.versionId,
			languageId: args.languageId,
		});

	}

	/**
	 * Ahh, Ahh, Ahh, Ahh, Staying alive, staying alive
	 * @returns {Promise}
	 */
	public keepAlive() {

		const keepAliveRequest = new KeepAlive({
			apiUrl: this.apiUrl,
		});

		return keepAliveRequest.execute();
	}

}

// Attach endpoint
const name = 'auth';
const getter = function (instance: ConnectorType) {
	return new Auth({
		apiUrl: instance.apiUrl,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		auth: Auth;
	}
}
