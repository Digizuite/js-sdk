// Make sure we can use async await in tests
import {install} from 'jasmine-co';
import {Connector, getConnectorInstance} from '../src/index';

install();

export const SITE_URL = 'https://localhost:59904';
export const USERNAME = 'SuperAdministrator';
export const PASSWORD = 'test';

/**
 * Quick method for getting a connector instance when testing
 *
 * @returns {Promise.<Connector>}
 */
export async function getInstance() {
	return await getConnectorInstance({
		siteUrl: SITE_URL,
	}).then(instance => instance.connectWithCredentials(USERNAME, PASSWORD));
}
