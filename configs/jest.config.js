const {
	consumerRoot,
	hasConsumerConfiguration,
	getKeyFromPackage,
	getPackageConfiguration,
	getConsumerConfiguration,
} = require('../utilities');

const config = {
	displayName: getKeyFromPackage('name'),
	moduleFileExtensions: [
		'js',
		'jsx',
	],
	rootDir: consumerRoot,
	setupFilesAfterEnv: [getPackageConfiguration('jest.setup')],
	testEnvironment: require.resolve('jest-environment-jsdom'),
	testEnvironmentOptions: {
		url: 'http://localhost:3000',
	},
	testMatch: [
		'<rootDir>/__test__/**/*.(test|spec).[jt]s?(x)',
		'<rootDir>/src/**/*.(test|spec).[jt]s?(x)',
	],
	testPathIgnorePatterns: ['/node_modules/'],
	transform: {
		'^.+\\.(js|jsx)?$': require.resolve('babel-jest'),
	},
	verbose: true,
};

if (hasConsumerConfiguration('jest.setup')) {
	config.setupFilesAfterEnv.push(getConsumerConfiguration('jest.setup'));
}

if (hasConsumerConfiguration('tsconfig')) {
	config.moduleFileExtensions = [
		...config.moduleFileExtensions,
		'ts',
		'tsx',
	];

	config.transform['^.+.(ts|tsx)?$'] = [
		require.resolve('ts-jest'),
		{ tsconfig: getConsumerConfiguration('tsconfig') },
	];
}

module.exports = config;
