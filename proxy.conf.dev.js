const PROXY_CONFIG =
  {
    '/api/*': {
      target: 'http://localhost:8001',
      pathRewrite: { '^/api/': '' },
      secure: false,
      changeOrigin: true,
      logLevel: 'debug'
    },
    '/github-api/*': {
      target: 'https://api.github.com',
      pathRewrite: { '^/github-api/': '' },
      secure: false,
      changeOrigin: true,
      logLevel: 'debug'
    }
  };
module.exports = PROXY_CONFIG;
