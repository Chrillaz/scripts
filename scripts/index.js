const { sync } = require('cross-spawn');
const chalk = require('chalk');
const { getPackageScript, getArgs, hasScript } = require('../utilities');
const { nodeArgs, scriptName, scriptArgs } = getArgs();

if (!scriptName) {
	console.log(
		'Ooops.. ' +
			'Looks like you forgot to pass which script to be executed ' +
			chalk.green(getScripts().join(' | '))
	);

	process.exit(1);
}

if (!hasScript(scriptName)) {
	console.log(
		'Ooops.. ' +
			chalk.red(scriptName) +
			' is not a valid script name. Maybee you meant to pass one of ' +
			chalk.green(getScripts().join(' | '))
	);

	process.exit(1);
}

const { signal, status } = sync(
	'node',
	[
		...nodeArgs,
		getPackageScript(scriptName),
		...scriptArgs,
	],
	{
		stdio: 'inherit',
	}
);

if (!signal) {
	process.exit(status || undefined);
}

if (signal === 'SIGKILL' || signal === 'SIGTERM') {
	console.log(chalk.red('The script failed because the process exited too early.'));
}

process.exit(1);