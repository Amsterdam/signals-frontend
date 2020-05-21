const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { HashedModuleIdsPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const template = require('./template');

module.exports = require('./webpack.base.babel')({
  mode: 'production',

  entry: [path.join(process.cwd(), 'src/app.js')],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            comparisons: false,
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 24,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](?!@datapunt[\\/]asc-ui)(?!leaflet)(?!react-reactive-form)/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `npm.${packageName.replace('@', '')}`;
          },
          reuseExistingChunk: true,
        },
        ascUI: {
          test: ({ context }) =>
            context && context.indexOf('/node_modules/@datapunt/asc-ui/') >= 0,
          reuseExistingChunk: true,
          name: 'npm.asc-ui',
        },
        lodash: {
          test: /lodash/,
          reuseExistingChunk: true,
          name: 'npm.lodash',
        },
        incident: {
          test: /[\\/]signals[\\/]incident[\\/]/,
          reuseExistingChunk: true,
          name: 'incident',
        },
        incidentManagement: {
          test: /[\\/]signals[\\/]incident-management[\\/]/,
          reuseExistingChunk: true,
          name: 'incident-management',
        },
        styledComponents: {
          test: /[\\/]node_modules[\\/](polished|styled-components|stylis|emotion)/,
          reuseExistingChunk: true,
          name: 'styled',
        },
        polyfill: {
          test: /([Pp]olyfill|whatwg-fetch|promise|object-assign)/,
          reuseExistingChunk: true,
          name: 'polyfills',
        },
        react: {
          test: /[\\/]node_modules[\\/](react)(-dom|-router|-is)?[\\/]/,
          reuseExistingChunk: true,
          name: 'react',
        },
        redux: {
          test: /[\\/]node_modules[\\/](connected-)?(redux-immutable|immutable|react|history|redux|reselect)(-router)?(-redux|-saga)?[\\/]/,
          reuseExistingChunk: true,
          name: 'redux',
        },
        leaflet: {
          test: /leaflet/,
          reuseExistingChunk: true,
          name: 'npm.leaflet',
          chunks: 'all',
          enforce: true,
        },
        reactiveForm: {
          test: ({ context }) =>
            context && context.indexOf('react-reactive-form') >= 0,
          reuseExistingChunk: true,
          name: 'npm.react-reactive-form',
          chunks: 'all',
          enforce: true,
        },
        datePicker: {
          test: ({ context }) =>
            context && (context.indexOf('react-datepicker') >= 0 || context.indexOf('popper') >= 0),
          reuseExistingChunk: true,
          name: 'npm.react-datepicker',
          chunks: 'all',
          enforce: true,
        },
        datePickerStyles: {
          name: 'react-datepicker',
          test: ({ constructor, context = '' }) =>
            constructor.name === 'CssModule' &&
            context &&
            (context.indexOf('react-datepicker') >= 0 ||
              context.indexOf('popper') >= 0),
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },

  plugins: [
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      ...template,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),

    new WebpackPwaManifest({
      name: 'Signalen Informatievoorziening Amsterdam',
      short_name: 'SIA',
      background_color: '#ffffff',
      theme_color: '#ec0000',
      inject: true,
      ios: true,
      display: 'fullscreen',
      orientation: 'portrait',
      icons: [
        {
          src: path.resolve('src/images/logo.png'),
          sizes: [96, 128, 192, 256, 384, 512],
        },
      ],
    }),

    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),

    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),

    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
    new OfflinePlugin({
      ServiceWorker: {
        events: true,
      },
      relativePaths: false,
      publicPath: '/',
      appShell: '/',

      excludes: ['version.txt', 'sw.js'],

      caches: {
        main: [':rest:'],

        // All chunks marked as `additional`, loaded after main section
        // and do not prevent SW to install. Change to `optional` if
        // do not want them to be preloaded at all (cached only when first loaded)
        additional: ['*.chunk.js'],
      },

      // Removes warning for about `additional` section usage
      safeToUseOptionalCaches: true,
    }),
  ],

  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
});
