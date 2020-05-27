const fs = require('fs');
const path = require('path');

const template = {};

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  const config = require('../../environment.conf.json');

  const configPlaceholder = '$SIGNALS_CONFIG';
  const configString = JSON.stringify(config);
  const indexFile = path.join(__dirname, '..', '..', 'src', 'index.html');

  template.templateContent = fs
    .readFileSync(indexFile)
    .toString()
    .replace(configPlaceholder, configString);
} else {
  template.template =  'src/index.html';
}

module.exports = template;
