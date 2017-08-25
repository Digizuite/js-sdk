/* global __dirname, require */
import {Server} from 'karma';

const server = new Server({
	configFile: __dirname + '/../karma.conf.js'
});

server.start();