import {Endpoint} from "../common/endpoint";
import {attachEndpoint, Connector as ConnectorType} from '../connector';
import {IConstants} from "../model/constants";
import { AppConstants } from '../request/configService/appConstants';

export class Constants extends Endpoint {
	public getConstants(): Promise<IConstants> {
		const connectorConfigRequest = new AppConstants({
			apiUrl: this.apiUrl,
		});

		return connectorConfigRequest.execute();
	}
}

// Attach constants endpoint
const constantsName = 'constants';
const constantsGetter = function (instance: ConnectorType) {
	return new Constants({
		apiUrl: instance.siteUrl,
	});
};

attachEndpoint({name: constantsName, getter: constantsGetter});

declare module '../connector' {
	interface Connector {
		constants: Constants;
	}
}
