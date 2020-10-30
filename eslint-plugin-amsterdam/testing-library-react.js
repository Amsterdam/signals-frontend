module.exports = {
  extends: ['plugin:testing-library/react'],
  plugins: ['testing-library'],
  env: { jest: true, node: true, },
  overrides: [
    {
      files: ['**/*.test.js', 'src/test/utils.js'],
      rules: {
        // proposed rules
        'testing-library/prefer-find-by': 'off', // Needs some manual work before it can be enabled
        'no-empty-function': 'off',

        // base overrides
        'max-len': 'off',
        'max-nested-callbacks': 'off',
        'no-constructor-return': 'off',
        'no-magic-numbers': 'off',
        'no-undef': 'off',
        'promise/always-return': 'off',
        'promise/avoid-new': 'off',
        'promise/catch-or-return': 'off', // Shall we prefer await?
        'promise/no-callback-in-promise': 'off',
        'require-await': 'off',
      },
    }
  ],
};
