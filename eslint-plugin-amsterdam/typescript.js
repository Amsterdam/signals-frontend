module.exports = {
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/all'],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        // to tweak?
        '@typescript-eslint/brace-style': 'off',
        '@typescript-eslint/lines-between-class-members': 'off',

        // requires strictNullChecks compiler option
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        '@typescript-eslint/indent': ['error', 2],
        '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
        // '@typescript-eslint/semi': ['error', 'never'],
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/space-before-function-paren': ['error', 'never'],

        '@typescript-eslint/member-delimiter-style': [
          'error', { singleline: { delimiter: 'comma', requireLast: false }, multiline: { delimiter: 'none' } },
        ],

        // disable for tests
        '@typescript-eslint/init-declarations': 'off',
        '@typescript-eslint/semi': ['error', 'always'],

        // extensions (superseded by typescript rules)
        'init-declarations': 'off',
        'no-use-before-define': 'off',
        // 'brace-style': 'off',
        // 'comma-spacing': 'off',
        // 'func-call-spacing': 'off',
        // 'indent': 'off',
        // 'no-extra-semi': 'off',
        // 'quotes': 'off',
        // 'require-await': 'off',
        // 'semi': 'off'
        // 'semi-style': 'off',
        // 'space-before-function-paren': 'off',
      },
    },
  ],
  rules: {
  },
};
