/* global __dirname, require, module  */
const webpack      = require('webpack');
const path         = require('path');
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
		
		plugins.push(
			new webpack.optimize.ModuleConcatenationPlugin()
		);
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
		
		externals: {
			'lodash': {
				commonjs : 'lodash',
				commonjs2: 'lodash',
				amd      : 'lodash',
				root     : '_'
			}
		},
		
		resolve: {
			modules   : [
				'src', 'node_modules', 'test'
			],
			extensions: ['.js']
		},
		
		resolveLoader: {
			modules: [
				'node_modules'
			]
		},
		
		module: {
			rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                        	plugins: ['transform-runtime'],
                            presets: ['env', 'es2017', 'es2015']
                        }
                    }
                }
			],
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