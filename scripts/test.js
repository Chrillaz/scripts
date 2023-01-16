const { sync: spawn } = require('cross-spawn');
const { sync: resolveBin } = require('resolve-bin');
const { getArgs, hasConfig, getPackageConfiguration } = require('../utilities');

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

const { scriptArgs } = getArgs();

const configArgs = hasConfig('jest')
	? []
	: [
			'--config',
			getPackageConfiguration('jest'),
	  ];

const { status } = spawn(
	resolveBin('jest'),
	[
		...configArgs,
		...scriptArgs,
	],
	{
		stdio: 'inherit',
	}
);

process.exit(status || 1);
