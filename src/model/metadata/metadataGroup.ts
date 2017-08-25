export interface IMetadataGroupArgs {
    id: number;
    name: string;
    sortIndex: number;
}

export class MetadataGroup {
	id: number;
    private name: string;
    private sortIndex: number;

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