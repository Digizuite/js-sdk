import {Model} from '../common/model';

export interface IFolderArgs {
	path: string;
	name: string;
	hasChildren: boolean | string;
	writable: boolean | string;
}

export function CreateFolderFromApiResponse(thisFolder: any) {
	const folder = new Folder(thisFolder);
	folder.setValueFromAPI(thisFolder);
	return folder;
}

export class Folder extends Model {
	public path: string;
	public name: string;
	public hasChildren: boolean;
	public writable: boolean;

	/**
	 * C-tor
	 * @param args
	 */
	constructor(args: IFolderArgs) {

		super();

		this.path = args.path;
		this.name = args.name;
		this.hasChildren = !!args.hasChildren;
		this.writable = !!args.writable;

	}

	/**
	 * Populates an asset from with the API values
	 * @param args
	 */
	public setValueFromAPI(args: any) {
		this.path = args.idPath;
		this.name = args.text;
		this.hasChildren = parseInt(args.Children, 10) > 0;
		this.writable = parseInt(args.writeaccess, 10) === 1;
	}

}
