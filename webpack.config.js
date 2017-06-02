/* global __dirname, require, module  */
const path    = require('path');
const BabiliPlugin = require('babili-webpack-plugin');

const ENV_PRODUCTION = 'prod';
const ENV_DEVELOPMENT = 'dev';

/**
 * Get webpack configs
 * @param env
 * @returns {*}
 */
function getWebpackConfig(env) {
	
	const plugins = [];
	
	if( env === ENV_PRODUCTION ) {
		plugins.push( new BabiliPlugin({
			mangle       : true,
			keepFnName   : true,
			keepClassName: true
		}) );
	}
	
	return 	{
		entry : 'index.js',
		output: {
			path          : path.resolve(__dirname, 'dist'),
			filename      : `digizuite${ env === ENV_PRODUCTION ? '.min' : ''}.js`,
			library       : 'Digizuite',
			libraryTarget : 'umd',
			umdNamedDefine: true
		},
		
		resolve: {
			modules   : [
				'src/', 'node_modules'
			],
			extensions: ['.js']
		},
		
		resolveLoader: {
			modules: [
				'node_modules',
				path.resolve(__dirname, 'src')
			]
		},
		
		module: {
			rules: [],
		},
		
		plugins,
		
		devtool: 'cheap-source-map',
	};
}

/**
 * Exports
 * @param env
 * @returns {[*]}
 */
module.exports = function(env) {
	
	const configs = [getWebpackConfig(ENV_DEVELOPMENT)];
	
	if( env === ENV_PRODUCTION ) {
		configs.push(getWebpackConfig(ENV_PRODUCTION));
	}
	
	return configs;
};