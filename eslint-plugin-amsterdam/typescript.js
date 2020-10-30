module.exports = {
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['**/*.ts(x)'],
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

        // extensions (superseded by other rules)
        // 'semi': 'off', // superseded by @typescript-eslint/semi
        // 'semi-style': 'off', // superseded by @typescript-eslint/semi
        // 'brace-style': 'off', // superseded by @typescript-eslint/brace-style
        // 'indent': 'off', // superseded by @typescript-eslint/indent
        // 'comma-spacing': 'off', // superseded by @typescript-eslint/comma-spacing
        // 'func-call-spacing': 'off', // superseded by @typescript-eslint/func-call-spacing
        // 'no-extra-semi': 'off', // superseded by @typescript-eslint/no-extra-semi
        // 'quotes': 'off', // superseded by @typescript-eslint/quotes
        // 'space-before-function-paren': 'off', // superseded by @typescript-eslint/space-before-function-paren
        // 'require-await': 'off', // superseded by @typescript-eslint/space-before-function-paren
        'init-declarations': 'off', // note you must disable the base rule as it can report incorrect errors
      },
    },
  ],
  rules: {
  },
};
