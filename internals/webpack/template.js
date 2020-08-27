const fs = require('fs');
const path = require('path');
const merge = require('lodash.merge');

const template = {};

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require */
  const baseConfig = require('../../environment.base.conf.json');
  const extendedConfig = require('../../environment.conf.json');

  const combinedConfig = merge({}, baseConfig, extendedConfig);

  const placeholders = {
    $SIGNALS_ANDROID_ICON: combinedConfig.head.androidIcon,
    $SIGNALS_BACKGROUND_COLOR: combinedConfig.head.backgroundColor,
    $SIGNALS_CONFIG: JSON.stringify(combinedConfig),
    $SIGNALS_FAVICON: combinedConfig.head.favicon,
    $SIGNALS_IOS_ICON: combinedConfig.head.iosIcon,
    $SIGNALS_MATOMO_SITE_ID: combinedConfig.matomo.siteId,
    $SIGNALS_MATOMO_URL_BASE: combinedConfig.matomo.urlBase,
    $SIGNALS_PWA_SHORT_TITLE: combinedConfig.language.shortTitle,
    $SIGNALS_PWA_TITLE: combinedConfig.language.title,
    $SIGNALS_SITE_TITLE: combinedConfig.language.siteTitle,
    $SIGNALS_STATUS_BAR_STYLE: combinedConfig.head.statusBarStyle,
    $SIGNALS_THEME_COLOR: combinedConfig.head.themeColor,
  };
  const indexFile = path.join(__dirname, '..', '..', 'src', 'index.html');
  const templateString = fs.readFileSync(indexFile).toString();

  const manifestFile = path.join(__dirname, '..', '..', 'src', 'manifest.json');
  const manifestString = fs.readFileSync(manifestFile).toString();

  template.templateContent = Object.entries(placeholders).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\${key}`, 'gm'), value),
    templateString
  );

  template.manifestContent = Object.entries(placeholders).reduce(
    (acc, [key, value]) => acc.replace(key, value),
    manifestString
  );
} else {
  template.template = 'src/index.html';
}

module.exports = template;
