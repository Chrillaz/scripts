const { getConsumerPath, hasPackage } = require('../utilities');

const config = {
	static: getConsumerPath('.'),
	compress: true,
	hot: true,
	port: 3000,
    open: true,
	historyApiFallback: hasPackage('react'),
};

module.exports = config;