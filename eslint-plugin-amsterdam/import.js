// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
module.exports = {
  extends: ['plugin:import/errors', 'plugin:import/recommended', 'plugin:import/react'],
  plugins: ['import'],
  settings: {
    'import/resolver': { node: { extensions: ['.js', '.ts', '.tsx'], moduleDirectory: ['node_modules', './src'] } },
  },
  rules: {
    // proposed rules
    'import/dynamic-import-chunkname': 'error',
    'import/no-anonymous-default-export': 'error',
    'import/no-commonjs': 'error',
    'import/no-unassigned-import': ['error', { allow: ['**/*.scss'] }],
    'import/no-webpack-loader-syntax': 'error',
    'import/order': 'error',
    'import/unambiguous': 'error',

    // disabled rules
    'import/exports-last': 'off',
    'import/group-exports': 'off',
    'import/max-dependencies': 'off',
    'import/newline-after-import': 'off',
    'import/no-default-export': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-internal-modules': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-export': 'off',
    'import/no-namespace': 'off',
    'import/no-relative-parent-imports': 'off',
    'import/prefer-default-export': 'off', // Would be nice on react components?

    // enabled rules
    'import/extensions': 'error',
    'import/first': 'error',
    'import/no-absolute-path': 'error',
    'import/no-amd': 'error',
    'import/no-cycle': 'error',
    'import/no-deprecated': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-named-default': 'error',
    'import/no-nodejs-modules': 'error',
    'import/no-restricted-paths': 'error',
    'import/no-self-import': 'error',
    'import/no-unresolved': ['error', { commonjs: true }],
    'import/no-unused-modules': 'error',
    'import/no-useless-path-segments': 'error',
  },
};
