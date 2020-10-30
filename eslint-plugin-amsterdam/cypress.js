module.exports = {
  extends: ['plugin:cypress/recommended'],
  plugins: ['cypress'],
  env: { browser: true, 'cypress/globals': true },
  rules: {
    // base overrides
    'promise/always-return': 'off',
    'promise/catch-or-return': 'off',
  },
};
