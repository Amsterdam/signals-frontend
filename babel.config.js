// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
module.exports = (api) => {
  api.cache(false)

  return {
    plugins: [
      'styled-components',
      '@babel/plugin-transform-modules-commonjs',
      '@babel/plugin-proposal-class-properties',
      [
        'inline-react-svg',
        {
          ignorePattern: '.*marker\\.svg',
        },
      ],
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-runtime',
    ],
    presets: [
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          targets: {
            esmodules: true,
            chrome: 42,
            firefox: 68,
          },
          corejs: 3,
        },
      ],
    ],
    env: {
      production: {
        only: ['src'],
        plugins: ['transform-react-remove-prop-types'],
      },
      test: {
        plugins: [
          [
            'babel-plugin-styled-components',
            { ssr: false, displayName: false, namespace: 'sc', pure: true },
          ],
        ],
      },
    },
  }
}
