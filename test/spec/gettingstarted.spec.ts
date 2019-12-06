import {PASSWORD, SITE_URL, USERNAME} from 'test/test-helpers';
import {getConnectorInstance} from '../../src/index';

describe('Getting Started', () => {

	it('Should login and give instance', (done) => {
		getConnectorInstance({
			siteUrl: SITE_URL,
		}).then(instance =>
			instance.connectWithCredentials(USERNAME, PASSWORD),
		).then(instance => {
			expect(instance).not.toBeNull();
			done();
		}).catch(err => {
			fail(err);
			done();
		});
	});

	it('should not login', done => {
		getConnectorInstance({
			siteUrl: SITE_URL,
		}).then(instance =>
			instance.connectWithCredentials(USERNAME, `${PASSWORD}-${PASSWORD}`),
		).then(instance => {
			fail('Logged in succeeded');
			done();
		}).catch(err => {
			expect(err).not.toBeNull();
			done();
		});
	});

});
