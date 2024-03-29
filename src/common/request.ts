import 'whatwg-fetch';
import {getGlobalContext} from "../utilities/helpers/env";
import {RequestError} from './requestError';

export interface IBaseRequestArgs {
	apiUrl: string;
	accessKey?: string;
}

export interface IRequestGetErrorCodeArgs {
	warnings: Array<{ Code: string }>;
	errors: Array<{ ErrorCode: string }>;
}

export enum HTTP_Method {
	Get = 'GET',
	Post = 'POST',
}

export class BaseRequest<T extends object, U> {
	/**
	 * Determines if a request fails based on the received response
	 * @param response
	 * @returns {boolean}
	 */
	public static containsError(response: { success: boolean | string }): boolean {
		return (response.success === 'false' || response.success === false);
	}

	/**
	 * Returns the error message from the response
	 * @param response
	 * @returns {string}
	 */
	public static getErrorMessage(response: { error: string, errors: Array<{ Description: string }> }): string {

		if (response.hasOwnProperty('error')) {
			return response.error;
		}

		if (response.hasOwnProperty('errors')) {
			return response.errors[0].Description;
		}

		return '¯\\_(ツ)_/¯';
	}

	/**
	 * Returns the error message from the response
	 * @param response
	 * @returns {Number}
	 */
	public static getErrorCode(response: IRequestGetErrorCodeArgs): number {

		if (response.hasOwnProperty('warnings') && response.warnings) {
			return parseInt(response.warnings[0].Code, 10);
		}

		if (response.hasOwnProperty('errors')) {
			return parseInt(response.errors[0].ErrorCode, 10);
		}

		return 0;
	}

	protected apiUrl: string;
	protected accessKey: string;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args: IBaseRequestArgs) {

		if (typeof args.apiUrl !== 'string' || args.apiUrl.length === 0) {
			throw new Error('apiUrl is a required parameter');
		}

		this.apiUrl = args.apiUrl;
		this.accessKey = args.accessKey || '';

	}

	/**
	 * To be overwritten
	 * @returns {string}
	 */
	get endpointUrl() {
		return this.apiUrl;
	}

	/**
	 * To be overwritten
	 * @returns {string}
	 */
	get method() {
		return HTTP_Method.Post;
	}

	/**
	 * To be overwritten
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {};
	}

	/**
	 * Execute!
	 * @param payload
	 * @returns {Promise}
	 */
	public execute(payload: T = {} as T): Promise<U> {

		// Merge the payload with the default one and pass it though the pre-process
		const requestData = this.processRequestData(
			{
				...this.defaultPayload,
				...payload,
				...(!!this.accessKey ? {accessKey: this.accessKey} : {}),
			},
		);

		const headers = new Headers({
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-Clacks-Overhead': 'GNU Terry Pratchett', // A man is not dead while his name is still spoken.
		});

		const requestOptions = {
			method: this.method,
			mode: 'cors',
			headers,
		} as any;

		if (requestOptions.method === HTTP_Method.Post) {
			requestOptions.body = this.toQueryString(requestData);
		}

		const request = new Request(
			this.endpointUrl,
			requestOptions,
		);

		// Settle in boys, papa is going to tell you a story about fetch and promise
		// See kids, when 2 or more browser vendors love each other very much,
		// they get together and make something special - a spec for a new feature!
		// And 9 months later, the spec is born by reaching stage 3.
		// However, developers are so exited, that they start using the feature,
		// even when it is in stage 0.
		// This is what happens here: Even if Promise.prototype.finally is currently in stage 2,
		// it is still being used by a lot of developers, by using poly libraries like Bluebird
		// (which work by replacing the native Promise with the one provided by Bluebird, in the window scope).
		// Furthermore, if you have a native method(like fetch) that returns a promise, that promise
		// will still be a native one, even if you are using Bluebird.
		// We can help those poor developers by chaining the fetch promise to a resolved promise.
		// This way, the result of this method will be a Promise create from the execution context,
		// instead of always a native one.
		return Promise.resolve()
			.then(() => fetch(request))
			.then(rawResponse => rawResponse.json())
			.then<U>((response) => {

				if (BaseRequest.containsError(response)) {
					throw new RequestError(
						BaseRequest.getErrorMessage(response),
						BaseRequest.getErrorCode(response),
					);
				}

				return this.processResponseData(response);
			});
	}

	/**
	 * Yeah....
	 * @param paramsObject
	 * @returns {string}
	 */
	public toQueryString(paramsObject: { [key: string]: string | string[] } = {}) {
		return Object
			.keys(paramsObject)
			.filter(key => paramsObject[key] !== undefined && paramsObject[key] !== null)
			.map(key => {
				const value = paramsObject[key];
				if (Array.isArray(value)) {
					return this.toTraditionalArray(key, value);
				} else {
					return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
				}
			})
			.join('&');
	}

	/**
	 *
	 * @param key
	 * @param array
	 * @returns {string}
	 */
	public toTraditionalArray(key: string, array: string[]) {
		return array.map((thisVal) => {
			return `${encodeURIComponent(key)}=${encodeURIComponent(thisVal)}`;
		}).join('&');
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {
		return payload;
	}

	/**
	 * Pass-through
	 * @param {Object} response
	 * @returns {Object}
	 */
	protected processResponseData(response: any): U {
		return response;
	}

}
