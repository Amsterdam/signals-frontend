// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
/* eslint-disable global-require */

/**
 * Front-end middleware
 */
module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd) {
    const addProdMiddlewares = require('./addProdMiddlewares')
    addProdMiddlewares(app, options)
  } else {
    const webpackConfig = require('../../internals/webpack/webpack.dev.babel')
    const addDevMiddlewares = require('./addDevMiddlewares')
    addDevMiddlewares(app, webpackConfig)
  }

  return app
}
