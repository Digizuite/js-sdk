import {attachEndpoint} from '../connector';
import {Endpoint} from '../common/endpoint';
import {Login} from '../request/connectService/login';
import {KeepAlive} from '../request/connectService/keepAlive';

export class Auth extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Number} [args.keepAliveInterval] - Timeout for making a keep alive request
	 */
	constructor( args = {}  ) {
		super(args);
		this.keepAliveInterval = args.keepAliveInterval || 60000;
	}
	
	/**
	 * Logs in a user
	 * @param {String} username - username to log in with
	 * @param {String} password - password of said user
	 * @returns {Promise}
	 */
	login( { username = '', password = '' } ) {
		
		const loginRequest = new Login({
			apiUrl : this.apiUrl
		});
		
		return loginRequest.execute({
			username, password
		});

	}
	
	/**
	 * Ahh, Ahh, Ahh, Ahh, Staying alive, staying alive
	 * @returns {Promise}
	 */
	keepAlive() {
		
		const keepAliveRequest = new KeepAlive({
			apiUrl : this.apiUrl
		});
		
		return keepAliveRequest.execute();
	}
	
}

// Attach endpoint
const name = 'auth';
const getter = function (instance) {
	return new Auth({
		apiUrl: instance.apiUrl
	});
};

attachEndpoint({ name, getter });
