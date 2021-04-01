// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
module.exports = {
  extends: ['plugin:cypress/recommended'],
  plugins: ['cypress'],
  env: { browser: true, 'cypress/globals': true },
  rules: {
    // base overrides
    'promise/always-return': 'off',
    'promise/catch-or-return': 'off',

    // rules
    'cypress/assertion-before-screenshot': 'error',
  },
};
