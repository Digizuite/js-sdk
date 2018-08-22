// Make sure we can use async await in tests
import {install} from 'jasmine-co';
import {Connector, getConnectorInstance} from '../src/index';

install();

/**
 * Quick method for getting a connector instance when testing
 *
 * @returns {Promise.<Connector>}
 */
export async function getInstance() {
	return await getConnectorInstance({
		apiUrl: 'https://cc.dev.digizuite.com/dmm3bwsv3/',
		username: 'SuperAdministrator',
		password: 'test',
	});
}
