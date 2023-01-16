const { sync: spawn } = require('cross-spawn');
const { sync: resolveBin } = require('resolve-bin');
const { getArgs, hasConfig, getPackageConfiguration } = require('../utilities');

process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';

const { scriptArgs } = getArgs();

const configArgs = hasConfig('webpack')
	? []
	: [
			'--config',
			getPackageConfiguration('webpack'),
	  ];

const { status } = spawn(
	resolveBin('webpack'),
	[
		...configArgs,
		...scriptArgs,
	],
	{
		stdio: 'inherit',
	}
);

process.exit(status || 1);
