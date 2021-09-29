// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
/* eslint consistent-return:0 import/order:0 */
const fs = require('fs')
const https = require('https')
const express = require('express')
const logger = require('./logger')
const compression = require('compression')

const argv = require('./argv')
const port = require('./port')
const { resolve } = require('path')
const { inject } = require('../internals/scripts/helpers/config')

const app = express()
const SSL = process.env.HTTPS
let options = {}

if (SSL) {
  const key = fs.readFileSync(`${__dirname}/proxy_cert/proxy.key`)
  const cert = fs.readFileSync(`${__dirname}/proxy_cert/proxy.crt`)
  options = {
    key,
    cert,
  }
}

const publicPath = '/'
const outputPath = resolve(process.cwd(), 'build')
const indexFile = resolve(outputPath, 'index.html')
const manifestFile = resolve(outputPath, 'manifest.json')

// inject configuration into public index file
const [indexContent, manifestContent] = inject([indexFile, manifestFile])
fs.writeFileSync(indexFile, indexContent)
fs.writeFileSync(manifestFile, manifestContent)

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// compression middleware compresses your server responses which makes them
// smaller (applies also to assets). You can read more about that technique
// and other good practices on official Express.js docs http://mxs.is/googmy
app.use(compression())
app.use(publicPath, express.static(outputPath))

app.get('*', (req, res) => res.sendFile(indexFile))

app.use('../assets', express.static('/assets'))

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST
const host = customHost || null // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost'
const server = SSL ? https.createServer(options, app) : app

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz' // eslint-disable-line
  res.set('Content-Encoding', 'gzip')
  next()
})

// Start your app.
server.listen(port, host, (error) => {
  if (error) {
    return logger.error(error.message)
  }

  const scheme = SSL ? 'https' : 'http'
  logger.appStarted(port, prettyHost, undefined, scheme)
})
