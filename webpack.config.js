const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/cmd/main.ts',
	target: 'node',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, './dist/cmd'),
		clean: true,
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				include: [path.resolve(__dirname, 'src')],
				exclude: /node_modules|__tests__|.*\.(spec|test)\.[jt]s?(x)/,
			},
		],
	},
	// plugins: [
	// 	new CopyWebpackPlugin({
	// 		patterns: [
	// 			{ from: './src/assets', to: 'assets' },
	// 			{ from: './src/views', to: 'views' },
	// 		],
	// 	}),
	// ],
	externals: ['pg-hstore'],
};
