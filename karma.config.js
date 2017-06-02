/* global require, module */
const args = require('./test/args');
const getBrowser = args.getBrowser;
const isWatching = args.isWatching;

module.exports = function (config) {
	config.set({
		basePath: '.',
		frameworks: ['browserify', 'source-map-support', 'mocha'],
		files: [
			'./test/setup.js',
			'./test/spec/**/*.spec.*'
		],
		exclude: [],
		preprocessors: {
			'src/**/*.js': [ 'browserify' ],
			'test/**/*.js': [ 'browserify' ]
		},
		reporters: ['mocha'],
		// web server port
		port: 9876,
		colors: true,
		logLevel: config.LOG_ERROR,
		autoWatch: true,
		browsers: [ getBrowser() ], // Chrome, PhantomJS, Firefox
		singleRun: !isWatching(),
		client: {
			captureConsole: true
		},
		browserify: {
			debug: true,
			insertGlobals: false,
			detectGlobals: true,
			noBuiltins: true,
			transform: [
				[ 'babelify', { sourceMaps: true }]
			],
			extensions: [ '.js' ]
		},
		plugins: [
			require('karma-browserify'),
			require('karma-chrome-launcher'),
			require('karma-mocha'),
			require('karma-mocha-reporter'),
			require('karma-source-map-support')
		]
	});
};
module.exports.getBrowser = getBrowser;