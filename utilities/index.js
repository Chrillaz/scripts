const { realpathSync, existsSync, readdirSync } = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');

const configExtensions = [
	'',
	'rc',
	'.config',
];

const extensions = [
	'',
	'.js',
	'.ts',
	'.json',
];

const consumerRoot = realpathSync(process.cwd());

const packageRoot = path.join(__dirname, '../');

const scriptsRoot = path.join(packageRoot, 'scripts');

const configsRoot = path.join(packageRoot, 'configs');

const packageJson = require(path.join(consumerRoot, 'package.json'));

const scripts = readdirSync(scriptsRoot);

/**
 *
 * @returns { Array }
 */
function getScripts() {
	return scripts
		.map((script) => path.basename(script, path.extname(script)))
		.filter((name) => name.toLowerCase() !== 'index');
}

/**
 *
 * @param { string } scriptName
 * @returns { boolean }
 */
function hasScript(scriptName) {
	return getScripts().some((name) => name === scriptName);
}

/**
 * Cachemap for resolved paths
 */
const resolvedPaths = new Map();

function resolve(key, resolver) {
	if (!resolvedPaths.has(key)) {
		const resolvedPath = resolver();
		if (resolvedPath) {
			resolvedPaths.set(key, resolvedPath);
		}
	}

	return resolvedPaths.get(key);
}

/**
 *
 * @param { string } fileName
 * @param { (file: string) => string } resolver
 * @returns { string | undefined }
 */
function resolveConfiguration(fileName, resolver) {
	let match;
	configExtensions.find((cext) =>
		extensions.some((fext) => {
			const test = resolver(fileName + cext + fext);
			const exists = existsSync(test);
			match = exists ? test : false;
			return exists;
		})
	);

	if (match) {
		return match;
	}
}

/**
 * Checks if package is in node_modules
 *
 * @param { string } packageName
 * @returns boolean
 */
function hasPackage(packageName) {
	try {
		return Boolean(
			require.resolve(packageName, {
				paths: [consumerRoot],
			})
		);
	} catch (error) {
		return false;
	}
}

/**
 *
 * @param { string } key
 * @returns
 */
function hasKeyInPackage(key) {
	return key in packageJson;
}

/**
 *
 * @param { string } key
 * @returns
 */
function getKeyFromPackage(key) {
	return hasKeyInPackage(key) ? packageJson[key] : key;
}

/**
 *
 * @param { string } configName
 * @param {*} resolver
 * @returns
 */
function getConfiguration(configName, resolver) {
	return resolve(configName, () => resolveConfiguration(configName, resolver));
}

/**
 *
 * @param { string } relPath
 * @returns
 */
function getConsumerPath(relPath) {
	return path.join(consumerRoot, relPath);
}

/**
 *
 * @param { string } configName
 * @returns { string }
 */
function getConsumerConfiguration(configName) {
	return getConfiguration(configName, getConsumerPath);
}

/**
 *
 * @param { string } configName
 * @returns { boolean }
 */
function hasConsumerConfiguration(configName) {
	return hasKeyInPackage(configName) || !!getConsumerConfiguration(configName);
}

/**
 *
 * @param { string } scriptName
 * @returns
 */
function getPackagePath(relPath) {
	return path.join(packageRoot, relPath);
}

/**
 *
 * @param { string } relPath
 * @returns { string }
 */
function getPackageConfig(relPath) {
	return getPackagePath('configs/' + relPath);
}

/**
 *
 * @param { string } relPath
 * @returns { string }
 */
function getPackageScript(relPath) {
	return getPackagePath('scripts/' + relPath);
}

/**
 *
 * @param { string } configName
 * @returns
 */
function getPackageConfiguration(configName) {
	return getConfiguration(configName, getPackageConfig);
}

/**
 *
 * @param { string } configName
 * @returns
 */
function hasPackageConfiguration(configName) {
	return !!getPackageConfiguration(configName);
}

/**
 * Checks if given key exists in process argv
 *
 * @param { string } arg
 * @return { boolean }
 */
function hasArg(arg) {
	return arg in argv;
}

/**
 *
 */
function getFileArg() {
	return argv._;
}

/**
 * Returns minimist parsed argv
 *
 * @return { object }
 */
function getArgs() {
	const args = process.argv.slice(2);
	const scripts = getScripts();
	const scriptIndex = args.findIndex((arg) => scripts.includes(arg));

	return {
		nodeArgs: args.slice(0, scriptIndex),
		scriptArgs: args.slice(scriptIndex + 1),
		scriptName: args[scriptIndex],
	};
}

/**
 * Checks if coonsumer has or provides config
 *
 * @param { string } configName
 * @returns boolean
 */
function hasConfig(configName) {
	return hasArg('config') || hasArg('c') || hasConsumerConfiguration(configName);
}

module.exports = {
	configsRoot,
	consumerRoot,
	getArgs,
	getConsumerConfiguration,
	getConsumerPath,
	getFileArg,
	getKeyFromPackage,
	getPackageConfig,
	getPackageConfiguration,
	getPackagePath,
	getPackageScript,
	getScripts,
	hasArg,
	hasConfig,
	hasConsumerConfiguration,
	hasKeyInPackage,
	hasPackage,
	hasPackageConfiguration,
	hasScript,
	scriptsRoot,
};
