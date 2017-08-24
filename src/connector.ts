import {ensureTrailingSeparator} from './utilities/helpers/url';
import {Endpoint} from "./common/endpoint";

import './endpoint/auth';
import './endpoint/config'

export class Connector {
    apiVersion: string;

    apiUrl: string;
	private keepAliveInterval: number;
    state: { user: any; config: any, keepAliveInterval: number };
	endpoints: {[key: string]: Endpoint};

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Number} [args.keepAliveInterval] - Timeout for making a keep alive request
	 */
    constructor(args: { apiUrl: string, keepAliveInterval?: number }) {
		
		if( typeof args.apiUrl !== 'string' || args.apiUrl.length === 0 ) {
			throw new Error( 'apiUrl is a required parameter' );
		}

		this.apiUrl = ensureTrailingSeparator(args.apiUrl);
		this.keepAliveInterval = args.keepAliveInterval || 60000;

        this.apiVersion = '';

		this.state = {
			user : {},
            config: {},
            keepAliveInterval: 0
		};

		this.endpoints = {};

	}
	
	/**
	 * Initialize the connector
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @returns {Promise}.<Connector> - a promise that will be resolved once the
	 */
	static getConnectorInstance( args: {apiUrl: string, username: string, password: string} ) {
		
		const digizuiteInstance = new Connector( args );
		return digizuiteInstance.initializeConnector( {
			username  : args.username,
			password  : args.password
		} );
		
	}
	
	/**
	 * Initializes a connector instance. Logs in and fetches the configs
	 * @param {Object} args
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @returns {Promise.<Connector>}
	 */
	initializeConnector( args: {username: string, password: string} ) {
		
		if( typeof args.username !== 'string' || args.username.length === 0 ) {
			return Promise.reject( new Error( 'username is a required parameter' ) );
		}
		
		if( typeof args.password !== 'string' || args.password.length === 0 ) {
			return Promise.reject( new Error( 'password is a required parameter' ) );
		}
		
		const bootstrapPromise = this.auth.login({
			username : args.username,
			password : args.password
		}).then((loginResponse)=>{
			this.state.user = loginResponse;
			this._initKeepAlive({
				username : args.username,
				password : args.password
			});
		}).then(()=>{

			return Promise.all([
				this.config.getAppConfiguration(),
				this.config.getSystemVersion(),
			]);

		}).then(([configResponse, versionResponse])=> {
			this.state.config = configResponse;
			this.apiVersion = versionResponse.Version;
			return this;
		});
		
		//We don't need this immediately, but we preload it for future use
		bootstrapPromise.then(()=>{
			this.config.getAppLabels();
		});
	
		return bootstrapPromise;
	}
	
	/**
	 * Initialize keep alive connection logic
	 * @param {Object} args
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @private
	 */
    _initKeepAlive(args: { username: string, password: string }) {
		
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
	
}

export const getConnectorInstance = Connector.getConnectorInstance;

export interface IAttachEndpoint<T extends Endpoint> {
	name: string;
	getter: (connector: Connector) => T;
}

/**
 * Attach a new endpoint to the connector
 */
export function attachEndpoint<T extends Endpoint>( {name, getter}: IAttachEndpoint<T> ) {

	Object.defineProperty(Connector.prototype, name,
		{
			get : function(this: Connector) {

				if( !this.endpoints[name] ) {
					this.endpoints[name] = getter(this);
				}
				
				return this.endpoints[name];
			}
		}
	);
}