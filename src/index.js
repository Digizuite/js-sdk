import endsWith from 'lodash/endsWith';
import {Auth} from 'endpoint/auth';
import {Config} from 'endpoint/config';

export class Connector {
	
	/**
	 * Getter for the auth endpoint
	 * @returns {Auth}
	 */
	get auth() {

		if( !this._authEndpoint ) {
			this._authEndpoint = new Auth( {
				apiUrl : this.apiUrl
			} );
		}
		
		return this._authEndpoint;
	}
	
	/**
	 * Getter for the auth endpoint
	 * @returns {Config}
	 */
	get config() {
		
		if( !this._configEndpoint ) {
			this._configEndpoint = new Config( {
				apiUrl : this.apiUrl
			} );
		}
		
		return this._configEndpoint;
	}
	
	//noinspection JSUnusedGlobalSymbols
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Number} [args.keepAliveInterval] - Timeout for making a keep alive request
	 */
	constructor( args = {} ) {
	
		if( typeof args.apiUrl !== 'string' || args.apiUrl.length === 0 ) {
			throw new Error( 'apiUrl is a required parameter' );
		}
		
		this.apiUrl = Connector.ensureTrailingSeparator(args.apiUrl);
		this.keepAliveInterval = args.keepAliveInterval || 60000;
		
		this.state = {
			user : {},
			config : {}
		};
	}
	
	/**
	 * Initialize the connector
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @returns {Promise}.<Connector> - a promise that will be resolved once the
	 */
	static getConnectorInstance( args = {} ) {
		
		const digizuiteInstance = new Connector( args );
		return digizuiteInstance.initializeConnector( {
			username  : args.username,
			password  : args.password
		} );
		
	}
	
	/**
	 * Inits a connector instance. Logs in and fetches the configs
	 * @param {Object} args
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @returns {Promise.<Connector>}
	 */
	initializeConnector( args = {} ) {
		
		if( typeof args.username !== 'string' || args.username.length === 0 ) {
			return Promise.reject( new Error( 'username is a required parameter' ) );
		}
		
		if( typeof args.password !== 'string' || args.password.length === 0 ) {
			return Promise.reject( new Error( 'password is a required parameter' ) );
		}
		
		return this.auth.login({
			username : args.username,
			password : args.password
		}).then((loginResponse)=>{
			this.state.user = loginResponse;
			this._initKeepAlive({
				username : args.username,
				password : args.password
			});
		}).then(()=>{
			return this.config.getAppConfiguration();
		}).then((configResponse)=> {
			this.state.config = configResponse;
			return this;
		});
		
	}
	
	/**
	 * Initialize keep alive connection logic
	 * @param {Object} args
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @private
	 */
	_initKeepAlive( args = {} ) {
		
		this.state.keepAliveInterval = setInterval(()=>{
			
			this.auth.keepAlive()
				.then((response)=>{
					if( !response.isLoggedIn ) {
						this.auth.login({
							username : args.username,
							password : args.password
						});
					}
				})
				.catch(()=>{
					this.auth.login({
						username : args.username,
						password : args.password
					});
				});
			
		}, this.keepAliveInterval);
		
	}
	
	/**
	 * Ensure correct trailing /
	 * @param url
	 * @returns {string}
	 */
	static ensureTrailingSeparator (url = '') {
		return url + (endsWith(url, '/') ? '' : '/');
	}
	
}