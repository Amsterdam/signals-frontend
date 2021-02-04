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
        // disabled
        '@typescript-eslint/typedef': 'off',
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',
        '@typescript-eslint/no-magic-numbers': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',

        // to tweak?
        '@typescript-eslint/brace-style': 'off',
        '@typescript-eslint/lines-between-class-members': 'off',

        // requires strictNullChecks compiler option
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        '@typescript-eslint/comma-dangle': [
          'error',
          {
            functions: 'never',
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
          },
        ],

        '@typescript-eslint/indent': ['error', 2],
        '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
        // '@typescript-eslint/semi': ['error', 'never'],
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/space-before-function-paren': ['error', 'never'],
        '@typescript-eslint/naming-convention': 'off',

        // '@typescript-eslint/member-delimiter-style': [
        //   'error', { singleline: { delimiter: 'comma', requireLast: false }, multiline: { delimiter: 'none' } },
        // ],

        // disable for tests
        '@typescript-eslint/init-declarations': 'off',
        '@typescript-eslint/semi': ['error', 'always'],

        '@typescript-eslint/no-type-alias': ['error', { allowAliases: 'in-unions-and-intersections' }],

        // extensions (superseded by typescript rules)
        'init-declarations': 'off',
        'no-use-before-define': 'off',
        'comma-dangle': 'off',
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

        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/object-curly-spacing': ['error', 'always'],
      },
    },
  ],
  rules: {},
};
