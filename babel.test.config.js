// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
module.exports = () => ({
  plugins: [
    'styled-components',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
  ],
  presets: [
    presetEnv,
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
  env: {
    plugins: [
      '@babel/plugin-transform-modules-commonjs',
      'dynamic-import-node',
    ],
  },
})
