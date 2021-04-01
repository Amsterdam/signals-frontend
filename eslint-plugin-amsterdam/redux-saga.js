// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
module.exports = {
  extends: [],
  plugins: ['redux-saga'],
  rules: {
    'redux-saga/no-yield-in-race': 'error',
    'redux-saga/yield-effects': 'error',
  },
};
