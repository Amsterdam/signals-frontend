module.exports = {
  extends: ['plugin:testing-library/react'],
  plugins: ['testing-library'],
  env: { jest: true, node: true },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        // base overrides
        'max-nested-callbacks': 'off',
        'no-constructor-return': 'off',
        'no-undef': 'off',
        'promise/always-return': 'off',
        'promise/avoid-new': 'off',
        'promise/catch-or-return': 'off',
        'promise/no-callback-in-promise': 'off',

        // proposed rules
        'no-magic-numbers': 'off',
        'max-len': 'off',
        'testing-library/prefer-find-by': 'off', // Needs some manual work before it can be enabled
        'no-empty-function': 'off',
        'require-await': 'off',

        // rules
        'testing-library/no-manual-cleanup': 'error',
        'testing-library/no-wait-for-empty-callback': 'error',
        'testing-library/no-wait-for-snapshot': 'error',
        'testing-library/prefer-explicit-assert': 'error',
        'testing-library/prefer-wait-for': 'error',
      },
    },
  ],
};
