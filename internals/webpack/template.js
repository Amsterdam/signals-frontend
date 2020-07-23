const fs = require('fs');
const path = require('path');
const merge = require('lodash.merge');

const template = {};

/* eslint-disable global-require */

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
  const config = require('../../environment.conf.json');
  const translations = require('../../translations.json');

  const devConfigFile = `../../environment.conf.${process.env.NODE_ENV}.json`;
  let devConfig = {};
  try {
    // eslint-disable-next-line
    devConfig = require(devConfigFile);
  } catch {
    // eslint-disable-next-line
    console.log(`You can use \`${devConfigFile}\` for configuration overwrites in your development environment.\n`);
  }

  const { lang } = combinedConfig;

  const combinedConfig = merge({}, config, devConfig);
  const placeholders = {
    $SIGNALS_ANDROID_ICON: combinedConfig.head.androidIcon,
    $SIGNALS_BACKGROUND_COLOR: combinedConfig.head.backgroundColor,
    $SIGNALS_CONFIG: JSON.stringify(combinedConfig),
    $SIGNALS_FAVICON: combinedConfig.head.favicon,
    $SIGNALS_IOS_ICON: combinedConfig.head.iosIcon,
    $SIGNALS_LANG: lang,
    $SIGNALS_PWA_SHORT_TITLE: translations[lang].translation.shortTitle,
    $SIGNALS_PWA_TITLE: translations[lang].translation.title,
    $SIGNALS_SITE_TITLE: translations[lang].translation.siteTitle,
    $SIGNALS_STATUS_BAR_STYLE: combinedConfig.head.statusBarStyle,
    $SIGNALS_THEME_COLOR: combinedConfig.head.themeColor,
    $SIGNALS_TRANSLATIONS: JSON.stringify(translations),
  };
  const indexFile = path.join(__dirname, '..', '..', 'src', 'index.html');
  const templateString = fs.readFileSync(indexFile).toString();

  const manifestFile = path.join(__dirname, '..', '..', 'src', 'manifest.json');
  const manifestString = fs.readFileSync(manifestFile).toString();

  template.templateContent = Object.keys(placeholders).reduce(
    (acc, key) => acc.replace(key, placeholders[key]),
    templateString
  );

  template.manifestContent = Object.keys(placeholders).reduce(
    (acc, key) => acc.replace(key, placeholders[key]),
    manifestString
  );
} else {
  template.template = 'src/index.html';
}

module.exports = template;
