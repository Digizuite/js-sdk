export interface IMetadataGroupArgs {
	id: number;
	name: string;
	sortIndex: number;
}

export class MetadataGroup {
	public id: number;
	public name: string;
	public sortIndex: number;

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IMetadataGroupArgs) {

		this.id = args.id;
		this.name = args.name;
		this.sortIndex = args.sortIndex;

	}

}
