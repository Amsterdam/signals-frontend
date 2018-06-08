const proxyConfig =
  {
    '/api/*': {
      target: 'http://localhost:8001',
      pathRewrite: { '^/api/': '' },
      secure: false,
      changeOrigin: true,
      logLevel: 'debug'
    }
  };
module.exports = proxyConfig;
