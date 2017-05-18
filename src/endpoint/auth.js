import {Endpoint} from './endpoint';
import {Login} from 'request/connectService/login';
import {KeepAlive} from 'request/connectService/keepAlive';

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
		
		this._stopKeepAlive();
		
		const loginPromise = loginRequest.execute({
			username, password
		});

		loginPromise.then(()=>{
			this._initKeepAlive({ username, password});
		}).catch(()=>{ /* LoL */ });

		return loginPromise;
	}
	
	/**
	 * Keeps the connection alive
	 * @param username
	 * @param password
	 * @private
	 */
	_initKeepAlive( { username = '', password = '' } ) {
		
		window._DigizuiteKeepAlive = setInterval(()=>{
			
			this._keepAlive()
				.then((response)=>{
					if( !response.isLoggedIn ) {
						this.login({ username, password });
					}
				})
				.catch(()=>{
					this.login({ username, password });
				});
			
		}, this.keepAliveInterval);
		
	}
	
	/**
	 * Stops keep alive, if it was setup
	 * @private
	 */
	_stopKeepAlive() {
		if( window._DigizuiteKeepAlive ){
			window.clearInterval(window._DigizuiteKeepAlive);
		}
	}
	
	/**
	 * Ahh, Ahh, Ahh, Ahh, Staying alive, staying alive
	 * @returns {Promise}
	 * @private
	 */
	_keepAlive() {
		
		const keepAliveRequest = new KeepAlive({
			apiUrl : this.apiUrl
		});
		
		return keepAliveRequest.execute();
	}
	
}