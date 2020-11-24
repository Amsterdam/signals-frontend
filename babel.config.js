module.exports = api => {
  const presetEnv =
    api.env() === 'lint'
      ? ''
      : [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          targets: {
            esmodules: true,
            chrome: 42,
            firefox: 68,
          },
          corejs: 3,
        },
      ];

  return {
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
    presets: [presetEnv, '@babel/preset-react'].filter(Boolean),
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
          '@babel/plugin-transform-modules-commonjs',
          'dynamic-import-node',
          ['babel-plugin-styled-components', { ssr: false, displayName: false, namespace: 'sc' }],
        ],
      },
    },
  };
};
