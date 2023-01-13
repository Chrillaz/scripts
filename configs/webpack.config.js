const TerserPlugin = require('terser-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const babelOptions = require('../configs/babel.options');
const browserslist = require('browserslist');

const {
	hasPackage,
	getConsumerPath,
	hasConsumerConfiguration,
	getPackagePath,
} = require('../utilities');

const context = getConsumerPath('.');

const isTypescriptProject = hasConsumerConfiguration('tsconfig');

const hasReact = hasPackage('react');

const extensions = [
	'.js',
	'.ejs',
];

if (isTypescriptProject) {
	extensions.push('.ts');
}

if (hasReact) {
	extensions.push('.jsx');
	if (isTypescriptProject) {
		extensions.push('.tsx');
	}
}

const devServer =
	process.env.NODE_ENV !== 'development'
		? undefined
		: {
				static: getConsumerPath('public'),
				compress: true,
				hot: true,
				port: 3000,
				open: true,
				historyApiFallback: hasPackage('react'),
		  };

const optimization = {
	minimize: true,
	minimizer: [
		new TerserPlugin({
			terserOptions: {
				compress: {
					ecma: 6,
					warnings: false,
					comparisons: false,
					inline: 2,
				},
				keep_classnames: false,
				keep_fnames: false,
				mangle: {
					safari10: true,
				},
				output: {
					ecma: 6,
					comments: false,
					ascii_only: true,
				},
			},
		}),
	],
};

const plugins = [
	new HTMLWebpackPlugin({
		inject: 'body',
		template: getConsumerPath('public/index.html'),
		output: getConsumerPath('dist'),
		publicPath: '/',
	}),
];

// let target = 'browserslist';
// if (!browserslist.findConfig('.')) {
// 	target += ':' + getPackagePath('configs/.browserslistrc');
// }

const config = {
	mode: process.env.NODE_ENV,
	context,
	// target,
	devtool: 'source-map',
	devServer,
	entry: getConsumerPath('src'),
	output: {
		filename: '[name].js',
		path: getConsumerPath('dist'),
		publicPath: '/',
	},
	optimization,
	resolve: {
		extensions,
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx|js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: require.resolve('babel-loader'),
					options: babelOptions,
				},
			},
		],
	},
	plugins: plugins.filter(Boolean),
};

module.exports = config;
