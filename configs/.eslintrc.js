const babelOptions = require('./babel.options');

module.exports = {
	env: {
		browser: true,
		es6: true,
		jest: true,
		node: true,
	},
	extends: [
		require.resolve('@chrillaz/eslint-plugin'),
	],
	parser: '@babel/eslint-parser',
	parserOptions: {
		babelOptions: {
			presets: babelOptions.presets,
		},
		requireConfigFile: false,
	},
	root: true,
	rules: {
		'@typescript-eslint/no-var-requires': 0,
	},
};
