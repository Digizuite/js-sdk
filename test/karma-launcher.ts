/* global __dirname */
import {Server} from 'karma';

const server = new Server({
	configFile: `${__dirname}/../karma.conf.js`,
});

server.start();
