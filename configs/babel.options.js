const { hasPackage, hasConsumerConfiguration } = require('../utilities');

const isEnvTest = process.env.NODE_ENV === 'test';

const options = {
	babelrc: false,
	compact: true,
	configFile: false,
};

options.presets = [
	[
		require.resolve('@babel/preset-env'),
		{
			modules: isEnvTest ? 'commonjs' : false,
		},
	],
];

if (hasConsumerConfiguration('tsconfig')) {
	options.presets = [
		require.resolve('@babel/preset-typescript'),
		...options.presets,
	];
}

if (hasPackage('react')) {
	options.presets = [
		...options.presets,
		[require.resolve('@babel/preset-react')],
	];
}

module.exports = options;
