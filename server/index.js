/* eslint-disable unicorn/import-style */
/* eslint consistent-return:0 import/order:0 */
const fs = require('fs');
const https = require('https');
const express = require('express');
const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const { resolve } = require('path');
const app = express();
const SSL = process.env.HTTPS;
let options = {};

if (SSL) {
  const key = fs.readFileSync(`${__dirname}/proxy_cert/proxy.key`);
  const cert = fs.readFileSync(`${__dirname}/proxy_cert/proxy.crt`);
  options = {
    key,
    cert,
  };
}

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

app.use('../assets', express.static('/assets'));

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';
const server = SSL ? https.createServer(options, app) : app;

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
server.listen(port, host, error => {
  if (error) {
    return logger.error(error.message);
  }

  const scheme = SSL ? 'https' : 'http';
  logger.appStarted(port, prettyHost, undefined, scheme);
});
