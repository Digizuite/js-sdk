// Karma configuration
// const webpackConfigFn = require('./webpack.config.ts');
// const webpackConfig = webpackConfigFn('dev')[0];
// webpackConfig.resolve.modules.push('test');
// // webpackConfig.module.rules;
// webpackConfig.devtool = 'inline-source-map';
//
// console.log(webpackConfig);

module.exports = function (config: any) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '.',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine', 'karma-typescript'],

		exclude: [
			'./**/*.d.ts',
		],

		// list of files / patterns to load in the browser
		files: [
			'./node_modules/bluebird/js/browser/bluebird.min.js',
			'./test/test-helpers.ts',
			{pattern: './src/**/*.ts'},
			{pattern: './test/**/*.spec.ts'},
		],

		preprocessors: {'**/*.ts': ['karma-typescript']},

		karmaTypescriptConfig: {
			compilerOptions: {
				module: 'commonjs',
				target: 'es5',
				moduleResolution: 'node',
				sourceMap: true,
				lib: [
					'es2015',
					'es2016',
					'es2017',
					'dom',
				],
			},
			tsconfig: './tsconfig.json',
			bundlerOptions: {
				entrypoints: /\.spec\.ts$/,
				transforms: [
					require("karma-typescript-es6-transform")(),
				],
			},
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['teamcity', 'karma-typescript'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_DISABLE,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],

		// webpack: webpackConfig,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: 5,

		browserNoActivityTimeout: 60000, // by default 10000

		defaultTimeoutInterval: 2500000,

		customLaunchers: {
			BetterChromeHeadless: {
				base: 'ChromeHeadless',
				flags: [
					'--no-sandbox',
					// See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
					'--headless',
					'--disable-gpu',
					// Without a remote debugging port, Google Chrome exits immediately.
					' --remote-debugging-port=9222',
				],
			},
		},

	});
};
