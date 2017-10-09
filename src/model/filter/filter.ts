export abstract class Filter {

	protected id: string;

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: { id: string }) {

		if (!args.id) {
			throw new Error('Expecting Filter to have id as parameter!');
		}

		this.id = args.id;
	}

	/**
	 * Generic method. Shall be overwritten
	 * @returns {*}
	 */
	protected abstract getAsSearchPayload(): { [key: string]: any };
}
