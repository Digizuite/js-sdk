import {Connector} from 'index';

describe('Getting Started', () => {

    it('Should login and give instance', (done)=>{
        Connector.getConnectorInstance({
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

});