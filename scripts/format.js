const { sync: spawn } = require('cross-spawn');
const { sync: resolveBin } = require('resolve-bin');
const {
	hasArg,
	getArgs,
	getFileArg,
	hasConfig,
	hasConsumerConfiguration,
	getPackageConfiguration,
} = require('../utilities');

const { scriptArgs } = getArgs();

const configArgs = hasConfig('.prettier')
	? []
	: [
			'--config',
			getPackageConfiguration('.prettier'),
	  ];

const hasPrettierIgnore = () =>
	hasArg('--ignore-path') || hasConsumerConfiguration('.prettierignore');

const ignoreArgs = hasPrettierIgnore()
	? []
	: [
			'--ignore-path',
			getPackageConfiguration('.prettierignore'),
	  ];

const checkArg = hasArg('check') ? '--check' : '--write';

const globArg = getFileArg().length > 0 ? [] : '**/*.{js,ts,jsx,tsx,json,yml,ymal}';

const { status } = spawn(
	resolveBin('prettier'),
	[
		...configArgs,
		...ignoreArgs,
		checkArg,
		...scriptArgs,
		globArg,
	],
	{
		stdio: 'inherit',
	}
);

process.exit(status || 1);