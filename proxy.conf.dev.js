const PROXY_CONFIG = {
  '/api/*': {
    target: 'http://localhost:5001',
    pathRewrite: { '^/api/': '' },
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/signals/v1/private/me/*': {
    target: 'http://localhost:5001',
    pathRewrite: { '^/signals/v1/private/me/': '' },
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
};
module.exports = PROXY_CONFIG;
