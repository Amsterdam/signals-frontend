const fs = require('fs');
const path = require('path');
const argv = require('./argv');

let proxyConfig = {};
try {
  if (argv && argv.proxyConfig) {
    const proxyPath = `./${argv.proxyConfig}`;
    fs.accessSync(proxyPath);
    proxyConfig = require(path.resolve(proxyPath)); // eslint-disable-line global-require
  }
} catch (e) {
  console.error(e); // eslint-disable-line no-console
}

module.exports = proxyConfig;
