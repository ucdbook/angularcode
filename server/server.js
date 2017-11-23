const path = require('path');

const projectConfig = require(process.env.configJson);

let serverInstance;
serverInstance = require('./legacy-server');

process.env.NODE_ENV = 'development';

exports.run = (options) => {
  serverInstance(options, projectConfig);
};


