import {getConnectorInstance} from 'index';
import {Connector} from 'index';
// Make sure we can use async await in tests
import {install} from 'jasmine-co';
install();


// Cache the promise, so the request is only done once.
const instancePromise = getConnectorInstance({
    apiUrl: 'https://mm.dev.digizuite.com/dmm3bwsv3/',
    username: 'admin',
    password: 'admin'
}).catch(err => {
    fail(err);
});

/**
 * Quick method for getting a connector instance when testing
 *
 * @returns {Promise.<Connector>}
 */
export function getInstance() {
    return instancePromise;
}