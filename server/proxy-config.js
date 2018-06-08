const fs = require('fs');
const path = require('path');
const argv = require('./argv');

let proxyConfig = {};
const proxyPath = `./${argv.proxyConfig}`;
try {
  fs.accessSync(proxyPath);
  proxyConfig = require(path.resolve(proxyPath)); // eslint-disable-line global-require
} catch (e) {
  console.error(e); // eslint-disable-line no-console
}

module.exports = proxyConfig;
