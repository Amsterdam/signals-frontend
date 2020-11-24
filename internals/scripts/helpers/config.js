const fs = require('fs');
const merge = require('lodash.merge');
const path = require('path');

const extendedConfigFileName = process.env.CONFIG || 'app.json';

const baseConfig = require('../../../app.base.json');
const extendedConfigFile = path.join(__dirname, '..', '..', '..', extendedConfigFileName);
const extendedConfig = fs.existsSync(extendedConfigFile) ? require(extendedConfigFile) : {};
const config = merge({}, baseConfig, extendedConfig);
const matomo = config.matomo
  ? `<noscript><img src="${config.matomo.urlBase}matomo.php?idsite=${config.matomo.siteId}&amp;rec=1" alt="" /></noscript>`
  : '';

const placeholders = {
  $SIGNALS_ANDROID_ICON: config.head.androidIcon,
  $SIGNALS_BACKGROUND_COLOR: config.head.backgroundColor,
  $SIGNALS_CONFIG: JSON.stringify(config),
  $SIGNALS_FAVICON: config.head.favicon,
  $SIGNALS_IOS_ICON: config.head.iosIcon,
  $SIGNALS_MATOMO: matomo,
  $SIGNALS_PWA_SHORT_TITLE: config.language.shortTitle,
  $SIGNALS_PWA_TITLE: config.language.title,
  $SIGNALS_SITE_TITLE: config.language.siteTitle,
  $SIGNALS_STATUS_BAR_STYLE: config.head.statusBarStyle,
  $SIGNALS_THEME_COLOR: config.head.themeColor,
};

const inject = files =>
  files.map(file =>
    Object.entries(placeholders).reduce(
      (acc, [key, value]) => acc.replace(new RegExp(`\\${key}`, 'gm'), value),
      fs.readFileSync(file).toString()
    )
  );

module.exports = {
  baseConfig,
  config,
  inject,
};
