module.exports = {
  extends: '.eslintrc.js',
  settings: {
    'import/resolver': {
      webpack: {
        config: './internals/webpack/webpack.dev.babel.js',
      },
    },
  },
};
