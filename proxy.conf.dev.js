const PROXY_CONFIG = {
  '/api/*': {
    target: 'http://localhost:5001',
    pathRewrite: { '^/api/': '' },
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/signals/user/auth/me/*': {
    target: 'http://localhost:5001',
    pathRewrite: { '^/signals/user/auth/me/': '' },
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
};
module.exports = PROXY_CONFIG;
