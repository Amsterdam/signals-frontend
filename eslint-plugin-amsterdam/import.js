module.exports = {
  // extends: ['plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript'],
  plugins: ['import'],
  rules: {
    // proposed rules
    'import/no-webpack-loader-syntax': 'error',

    // disabled rules
    'import/imports-first': 'off',
    'import/newline-after-import': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'import/prefer-default-export': 'off', // Would be nice on react components?

    // enabled rules
    'import/extensions': 'error',
    'import/first': 'error',
    'import/no-amd': 'error',
    'import/no-unresolved': ['error', { commonjs: true, }],
  },
};
