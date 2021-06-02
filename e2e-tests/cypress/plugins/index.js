// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
const webpack = require('@cypress/webpack-preprocessor');
module.exports = on => {
  const options = {
    webpackOptions: require('../../webpack.config'),
    watchOptions: {}
  };

  on('file:preprocessor', webpack(options));
};
