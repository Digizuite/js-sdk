const path    = require('path');

module.exports = {
	entry : "index.js",
	output: {
		path          : path.resolve(__dirname, 'dist'),
		filename      : 'digizuite.js',
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
			path.resolve(__dirname, "src")
		]
	},
	
	module: {
		rules: [],
	},
	
	plugins: [],
	
	devtool: 'cheap-source-map',
	
};