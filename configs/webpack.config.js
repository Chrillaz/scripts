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
				compress: true,
				historyApiFallback: hasPackage('react'),
				hot: true,
				open: true,
				port: 3000,
				static: getConsumerPath('public'),
		  };

const optimization = {
	minimize: true,
	minimizer: [
		new TerserPlugin({
			terserOptions: {
				compress: {
					comparisons: false,
					ecma: 6,
					inline: 2,
					warnings: false,
				},
				keep_classnames: false,
				keep_fnames: false,
				mangle: {
					safari10: true,
				},
				output: {
					ascii_only: true,
					comments: false,
					ecma: 6,
				},
			},
		}),
	],
};

const plugins = [
	new HTMLWebpackPlugin({
		inject: 'body',
		output: getConsumerPath('dist'),
		publicPath: '/',
		template: getConsumerPath('public/index.html'),
	}),
];

let target = 'browserslist';
if (!browserslist.findConfig('.')) {
	target += ':' + getPackagePath('configs/.browserslistrc');
}

const config = {
	context,
	devServer,
	devtool: 'source-map',
	entry: getConsumerPath('src'),
	mode: process.env.NODE_ENV,
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.(ts|tsx|js|jsx)$/,
				use: {
					loader: require.resolve('babel-loader'),
					options: babelOptions,
				},
			},
		],
	},
	optimization,
	output: {
		filename: '[name].js',
		path: getConsumerPath('dist'),
		publicPath: '/',
	},
	plugins: plugins.filter(Boolean),
	resolve: {
		extensions,
	},
	target,
};

module.exports = config;
