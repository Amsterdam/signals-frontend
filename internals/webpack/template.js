const fs = require('fs');
const path = require('path');
const merge = require('lodash.merge');

const template = {};

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  const config = require('../../environment.conf.json');

  const devConfigFile = `../../environment.conf.${process.env.NODE_ENV}.json`;
  let devConfig = {};
  try {
    // eslint-disable-next-line
    devConfig = require(devConfigFile);
  } catch (e) {
    // eslint-disable-next-line
    console.log(`You can use \`${devConfigFile}\` for configuration overwrites in your development environment.\n`);
  }

  const combinedConfig = merge({}, config, devConfig);
  const siteTitlePlaceholder = '$SIGNALS_SITE_TITLE';
  const siteTitleString = combinedConfig.language.siteTitle;
  const configPlaceholder = '$SIGNALS_CONFIG';
  const configString = JSON.stringify(combinedConfig);
  const indexFile = path.join(__dirname, '..', '..', 'src', 'index.html');

  template.templateContent = fs
    .readFileSync(indexFile)
    .toString()
    .replace(siteTitlePlaceholder, siteTitleString)
    .replace(configPlaceholder, configString);
} else {
  template.template = 'src/index.html';
}

module.exports = template;
