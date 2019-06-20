import {Asset} from "../model/asset";
import {LockInformation} from '../request/itemControlService/lockInformation';

export function getLockInformation(args: { asset: Asset, apiUrl: string, accessKey: string }) {

	if (!args.asset) {
		throw new Error('getLockInformation expected an asset as parameter!');
	}

	const lockInformationRequest = new LockInformation({
		apiUrl: args.apiUrl,
		accessKey: args.accessKey,
	});

	return lockInformationRequest.execute({
		asset: args.asset,
	});
}
