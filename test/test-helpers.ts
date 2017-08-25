import {Connector, getConnectorInstance} from '../src/index';
// Make sure we can use async await in tests
require('jasmine-co').install();

/**
 * Quick method for getting a connector instance when testing
 *
 * @returns {Promise.<Connector>}
 */
export async function getInstance() {
	return await getConnectorInstance({
        apiUrl: 'https://cc.dev.digizuite.com/dmm3bwsv3/',
        username: 'admin',
        password: 'admin'
    });
}