const fs = require('fs');

const config = require('./helpers/get-config');

const placeholders = {
  $SIGNALS_ANDROID_ICON: config.head.androidIcon,
  $SIGNALS_BACKGROUND_COLOR: config.head.backgroundColor,
  $SIGNALS_CONFIG: JSON.stringify(config),
  $SIGNALS_FAVICON: config.head.favicon,
  $SIGNALS_IOS_ICON: config.head.iosIcon,
  $SIGNALS_MATOMO_SITE_ID: config.matomo.siteId,
  $SIGNALS_MATOMO_URL_BASE: config.matomo.urlBase,
  $SIGNALS_PWA_SHORT_TITLE: config.language.shortTitle,
  $SIGNALS_PWA_TITLE: config.language.title,
  $SIGNALS_SITE_TITLE: config.language.siteTitle,
  $SIGNALS_STATUS_BAR_STYLE: config.head.statusBarStyle,
  $SIGNALS_THEME_COLOR: config.head.themeColor,
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
