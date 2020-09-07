const merge = require('lodash.merge');

const baseConfig = require('../../../environment.base.conf.json');
const extendedConfig = require('../../../environment.conf.json');

module.exports = merge({}, baseConfig, extendedConfig);
