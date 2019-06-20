import {Endpoint} from '../common/endpoint';
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {BatchUpdate} from '../request/batchUpdateService/batchUpdate';
import {UpdateContainer} from '../utilities/updateContainer';

export class Batch extends Endpoint {

	/**
	 * Make a batch update
	 * @param {Object} args
	 * @param {UpdateContainer[]} args.containers
	 * @return {Promise}
	 */
	public update(args: { containers: UpdateContainer[] }) {

		// Ensure that we have containers in the format we want
		if (
			!args.hasOwnProperty('containers') ||
			!Array.isArray(args.containers) ||
			args.containers.length === 0
		) {
			throw new Error('Batch expects an array of containers as parameter.');
		}

		args.containers.forEach((thisContainer) => {
			if (!(thisContainer instanceof UpdateContainer)) {
				throw new Error('Batch expects containers to be of type UpdateContainer.');
			}
		});

		const batchUpdateRequest = new BatchUpdate({
			apiUrl: this.apiUrl,
			accessKey: this.accessKey,
		});

		return batchUpdateRequest.execute({
			containers: args.containers,
		});

	}

}

// Attach endpoint
const name = 'batch';
const getter = function (instance: ConnectorType) {
	return new Batch({
		apiUrl: instance.apiUrl,
		accessKey: instance.state.user.accessKey,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		batch: Batch;
	}
}
