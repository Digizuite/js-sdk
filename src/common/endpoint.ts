export interface IEndpointArgs {
	apiUrl: string;
	accessKey?: string;
}

export class Endpoint {

	protected apiUrl: string;
	protected accessKey: string = '';

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args: IEndpointArgs) {

		if (typeof args.apiUrl !== 'string' || args.apiUrl.length === 0) {
			throw new Error('apiUrl is a required parameter');
		}

		this.apiUrl = args.apiUrl;

		if (args.accessKey) {
			this.accessKey = args.accessKey;
		}

	}

}
