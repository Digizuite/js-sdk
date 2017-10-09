import {BaseRequest} from '../../common/request';
import {IUpdateContainerJson, UpdateContainer} from '../../utilities/updateContainer';

export class BatchUpdate extends BaseRequest<any> {

	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}BatchUpdateService.js`;
	}

	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			useMetadataVersionedAccess: 0,
			updateXML: '',
			values: [],
		};
	}

	/**
	 * Execute the request
	 * @param {Object} payload
	 * @returns {Promise}
	 */
	public execute(payload: { containers: UpdateContainer[] }) {

		// Ensure that we have containers in the format we want
		if (
			!payload.hasOwnProperty('containers') ||
			!Array.isArray(payload.containers) ||
			payload.containers.length === 0
		) {
			throw new Error('BatchUpdate expects an array of containers as parameter.');
		}

		payload.containers.forEach((thisContainer) => {
			if (!(thisContainer instanceof UpdateContainer)) {
				throw new Error('BatchUpdate expects containers to be of type UpdateContainer.');
			}
		});

		return super.execute(payload);
	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: { containers?: UpdateContainer[], updateXML?: string, values?: string }) {

		let xml = '';
		const values: IUpdateContainerJson[] = [];

		// Merge XML and JSON from all containers
		payload.containers!.forEach((thisContainer) => {
			xml += thisContainer.getContainerXML();
			values.push(thisContainer.getContainerJSON());
		});

		// Batch values
		payload.updateXML = `<r>${xml}</r>`;
		payload.values = JSON.stringify(values);

		// remove containers
		payload.containers = undefined;

		return payload;
	}

	/**
	 * Process response
	 * @param response
	 */
	protected processResponseData(response: any) {
		return response.items;
	}

}
