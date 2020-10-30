module.exports = {
  extends: ['plugin:cypress/recommended'],
  plugins: ['cypress'],
  env: { browser: true, es6: true, 'cypress/globals': true, },
  // parserOptions: {
  //   ecmaVersion: 6,
  //   sourceType: 'module',
  //   ecmaFeatures: {
  //     jsx: true,
  //   },
  // },
  rules: {
    // base overrides
    'promise/always-return': 'off',
    'promise/catch-or-return': 'off',
  },
};
