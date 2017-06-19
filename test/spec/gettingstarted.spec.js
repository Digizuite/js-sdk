import {getConnectorInstance} from 'index';

describe('Getting Started', () => {

    it('Should login and give instance', (done)=>{
        getConnectorInstance({
            apiUrl: 'https://mm.dev.digizuite.com/dmm3bwsv3/',
            username: 'admin',
            password: 'admin'
        }).then(instance => {
            expect(instance).not.toBeNull();
            done();
        }).catch(err => {
            fail(err);
            done();
        });
    });

    it('should not login', done => {
        getConnectorInstance({
            apiUrl: 'https://mm.dev.digizuite.com/dmm3bwsv3/',
            username: 'admin',
            password: 'wrongpassword'
        }).then(() => {
            fail('Logged in succeded');
            done();
        }).catch(err => {
            expect(err).not.toBeNull();
            done();
        });
    });

});