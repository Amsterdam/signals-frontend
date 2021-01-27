module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['plugin:amsterdam/base', 'plugin:amsterdam/cypress', 'plugin:amsterdam/typescript'],
  overrides: [
    {
      files: ['./eslint-plugin-amsterdam/**/*', 'jest.config.*', './internals/**/*', './server/**/*'],
      extends: ['plugin:amsterdam/typescript'],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/space-before-function-paren': 'off',
        '@typescript-eslint/no-type-alias': ['off'],
        '@typescript-eslint/no-empty-function': ['off'],
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/unbound-method': [
          'error',
          {
            ignoreStatic: true,
          },
        ],
      },
    },
  ],
  rules: {
    // # overrides
    camelcase: 'off',

    // # proposed rules
    // # semi: [error, never]
    'comma-dangle': 'off',
    'cypress/no-force': 'off',
    'cypress/require-data-selectors': 'off',
    'line-comment-position': 'off',
    'max-len': 'off',
    'no-extra-parens': 'off',
    'no-magic-numbers': 'off',
    'no-undef': 'off',
    'no-use-before-define': 'off',
    'promise/prefer-await-to-then': 'off',
    'require-unicode-regexp': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'sonarjs/no-identical-functions': 'off',
    'unicorn/prevent-abbreviations': 'off',
  },
};
