// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
module.exports = {
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:promise/recommended',
    'plugin:redux-saga/recommended',
    'plugin:testing-library/react',
    'plugin:import/typescript',
    'prettier',
    'prettier/react',
  ],
  globals: {
    L: true,
  },
  overrides: [
    {
      files: ['**/*.test.*'],
      rules: {
        'no-import-assign': 'off',
        'react/display-name': 'off',
        'redux-saga/no-unhandled-errors': 'off',
      },
    },
    {
      extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        'react-hooks/exhaustive-deps': 1,
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            ignoreRestSiblings: true,
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'jest'],
  root: true,
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/valid-expect': 'error',
    'import/first': 'error',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    'jsx-quotes': ['error', 'prefer-double'],
    'jsx-a11y/aria-role': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react',
            importNames: ['default'],
          },
        ],
      },
    ],
    'no-undef': 'off',
    'promise/always-return': 'off',
    'promise/catch-or-return': 'off',
    'promise/no-callback-in-promise': 'off',
    'react/display-name': 'off',
    'react/jsx-key': 'off',
    'react/prop-types': 'off',
    'redux-saga/no-unhandled-errors': 'off',
    'require-yield': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
}
