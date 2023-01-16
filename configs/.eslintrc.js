module.exports = {
	extends: [
		'plugin:@chrillaz/eslint-plugin',
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
            presets: [ require('./babel.options').presets ]
        },
	},
};
