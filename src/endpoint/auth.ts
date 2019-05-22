import {Endpoint} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {KeepAlive} from '../request/connectService/keepAlive';
import {Login} from '../request/connectService/login';

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
	public login({username = '', password = ''}): Promise<any> {

		const loginRequest = new Login({
			apiUrl: this.apiUrl,
		});

		return loginRequest.execute({
			username, password,
		});

	}

	/**
	 * Logs in a user
	 * @returns {Promise}
	 * @param accessKey
	 */
	public loginWithAccessKey(accessKey: string): Promise<any> {

		const loginRequest = new Login({
			apiUrl: this.apiUrl,
		});

		return loginRequest.execute({
			accessKey,
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
