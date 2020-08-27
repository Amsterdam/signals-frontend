const fs = require('fs');
const merge = require('lodash.merge');

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

const indexFile = '/usr/share/nginx/html/index.html';
const indexString = fs.readFileSync(indexFile).toString();
const indexContent = Object.entries(placeholders).reduce(
  (acc, [key, value]) => acc.replace(new RegExp(`\\${key}`, 'gm'), value),
  indexString
);
fs.writeFileSync(indexFile, indexContent);

const manifestFile = '/usr/share/nginx/html/manifest.json';
const manifestString = fs.readFileSync(manifestFile).toString();
const manifestContent = Object.entries(placeholders).reduce(
  (acc, [key, value]) => acc.replace(key, value),
  manifestString
);
fs.writeFileSync(manifestFile, manifestContent);
