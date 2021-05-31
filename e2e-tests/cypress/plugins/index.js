// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import webpack from '@cypress/webpack-preprocessor';
export default on => {
  const options = {
    webpackOptions: require('../../webpack.config'),
    watchOptions: {}
  };

  on('file:preprocessor', webpack(options));
};
