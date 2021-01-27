// / <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = () => {
  // you could eventually use those function parameters:
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
};

module.exports = (on, config) => {
  config.ignoreTestFiles = '**/_localRun/*.spec.js';
  return config;
};

const webpack = require('@cypress/webpack-preprocessor');
module.exports = on => {
  const options = {
    // send in the options from your webpack.config.js, so it works the same
    // as your app's code
    webpackOptions: require('../../webpack.config'),
    watchOptions: {}
  };

  on('file:preprocessor', webpack(options));
};
