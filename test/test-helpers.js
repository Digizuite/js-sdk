import {getConnectorInstance} from '../src/connector';
// Make sure we can use async await in tests
import {install} from 'jasmine-co';
install();

/**
 * Quick method for getting a connector instance when testing
 *
 * @returns {Promise.<Connector>}
 */
export function getInstance() {
	return getConnectorInstance({
		apiUrl: 'https://cc.dev.digizuite.com/dmm3bwsv3/',
		username: 'admin',
		password: 'admin'
	}).catch(err => {
		fail(err);
	});
}