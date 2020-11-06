module.exports = {
  extends: [],
  plugins: ['redux-saga'],
  rules: {
    'redux-saga/no-yield-in-race': 'error',
    'redux-saga/yield-effects': 'error',
  },
};
