const fs = require('fs');
const path = require('path');
const argv = require('./argv');

console.log('process.env.PROXY_CONFIG: ', process.env.PROXY_CONFIG);  // eslint-disable-line no-console
console.log('argv: ', argv); // eslint-disable-line no-console
console.log('argv.proxyConfig: ', argv.proxyConfig); // eslint-disable-line no-console

let proxyConfig = {};
const proxyPath = path.resolve(
  (process.env.PROXY_CONFIG && argv && argv.proxyConfig) ||
  'proxy.conf.prod.js'
);
console.log('proxyConfig:', proxyPath); // eslint-disable-line no-console

if (fs.existsSync(proxyPath)) {
  proxyConfig = require(proxyPath); // eslint-disable-line global-require
}

module.exports = proxyConfig;
