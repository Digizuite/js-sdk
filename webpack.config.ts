/* tslint:disable */
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
/* tslint:enable */
/* global __dirname, module  */

const ENV_PRODUCTION = 'prod';
const ENV_DEVELOPMENT = 'dev';

/**
 * Get webpack configs
 * @param env
 * @returns {*}
 */
function getWebpackConfig(env: string) {

	const plugins = [];

	if (env === ENV_PRODUCTION) {
		plugins.push(
			new webpack.optimize.ModuleConcatenationPlugin(),
		);

		plugins.push(
			new UglifyJSPlugin(),
		);
	}

	return {
		entry: './src/index.ts',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: `digizuite${ env === ENV_PRODUCTION ? '.min' : ''}.js`,
			library: 'Digizuite',
			libraryTarget: 'umd',
			umdNamedDefine: true,
		},

		externals: {
			'lodash-es': {
				commonjs: 'lodash',
				commonjs2: 'lodash',
				amd: 'lodash',
				root: '_',
			},
		},

		resolve: {
			modules: [
				'src', 'node_modules', 'test',
			],
			extensions: ['.js', '.ts'],
		},

		resolveLoader: {
			modules: [
				'node_modules',
			],
		},

		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /(node_modules|bower_components)/,
					use: [
						{
							loader: 'awesome-typescript-loader',
						},
					],
				},
			],
		},

		plugins,

		devtool: 'source-map',
	};
}

/**
 * Exports
 * @param env
 * @returns {[*]}
 */
module.exports = function (env: string) {

	const configs = [getWebpackConfig(ENV_DEVELOPMENT)];

	if (env === ENV_PRODUCTION) {
		configs.push(getWebpackConfig(ENV_PRODUCTION));
	}

	return configs;
};
