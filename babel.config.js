module.exports = {
  plugins: [
    'styled-components',
    '@babel/plugin-proposal-class-properties',
    [
      'inline-react-svg',
      {
        ignorePattern: '.*marker\\.svg',
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        targets: {
          esmodules: true,
        },
        corejs: 3,
      },
    ],
    '@babel/preset-react',
  ],
  env: {
    production: {
      only: ['src'],
      plugins: [
        'transform-react-remove-prop-types',
        '@babel/plugin-transform-react-inline-elements',
        '@babel/plugin-transform-react-constant-elements',
      ],
    },
    test: {
      plugins: [
        'dynamic-import-node',
      ],
    },
  },
};
