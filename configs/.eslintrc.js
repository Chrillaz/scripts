module.exports = {
    root: true,
	extends: [
		require.resolve('@chrillaz/eslint-plugin'),
	],
	env: {
		browser: true,
		node: true,
		jest: true,
		es6: true,
	},
	parser: '@babel/eslint-parser',
	parserOptions: {
        requireConfigFile: false,
	    babelOptions: {
            presets: require('./babel.options').presets
        },
	},
};
