/* global __dirname, require */
const Server = require('karma').Server;

const server = new Server({
	configFile: __dirname + '/../karma.conf.js'
});

server.start();