export interface IEndpointArgs {
	apiUrl: string;
}

export class Endpoint {

	protected apiUrl: string;

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

	}

}
