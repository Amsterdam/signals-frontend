// Important modules this config uses
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const WebpackPwaManifest = require('webpack-pwa-manifest');
const { HashedModuleIdsPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = require('./webpack.base.babel')({
  mode: 'production',

  // In production, we skip all hot-reloading stuff
  entry: [
    require.resolve('react-app-polyfill/ie11'),
    path.join(process.cwd(), 'src/app.js'),
  ],

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
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 10,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    // splitChunks: {
    //   chunks: 'all',
    //   minSize: 30000,
    //   minChunks: 1,
    //   maxAsyncRequests: 5,
    //   maxInitialRequests: 3,
    //   name: true,
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/](?!amsterdam-stijl|style-loader|css-loader|amsterdam-amaps|history|stylis|reselect|react|react-dom|(connected-)?react-router|react-router-dom|react-intl|redux|@?redux-saga|react-redux|react-helmet|styled-components|@babel|react-app-polyfill|polished|@datapunt)[\\/]/,
    //       name: 'vendor',
    //       chunks: 'all',
    //     },
    //     amaps: {
    //       test: /[\\/]node_modules[\\/](amsterdam-amaps)[\\/]/,
    //       name: 'amaps',
    //       chunks: 'all',
    //       enforce: true,
    //     },
    //     datapunt: {
    //       test: /[\\/]node_modules[\\/](@datapunt)[\\/]/,
    //       name: 'datapunt',
    //       chunks: 'all',
    //       enforce: true,
    //     },
    //     polyfill: {
    //       test: /[\\/]node_modules[\\/](@babel|react-app-polyfill)[\\/]/,
    //       name: 'polyfill',
    //       chunks: 'all',
    //       enforce: true,
    //     },
    //     amsterdamStijlAssets: {
    //       test: /[\\/]node_modules[\\/]amsterdam-stijl[\\/]dist[\\/](?!css)/,
    //       name: 'amsterdam-stijl-assets',
    //       chunks: 'all',
    //       enforce: true,
    //     },
    //     amsterdamStijlCSS: {
    //       test: /[\\/]node_modules[\\/](amsterdam-stijl[\\/]dist[\\/]css)[\\/]/,
    //       name: 'amsterdam-stijl-css',
    //       chunks: 'all',
    //       enforce: true,
    //     },
    //     styled: {
    //       test: /[\\/]node_modules[\\/](styled-components|polished|style-loader|css-loader|stylis)[\\/]/,
    //       name: 'styled',
    //       chunks: 'all',
    //       enforce: true,
    //     },
    //     react: {
    //       test: /[\\/]node_modules[\\/](react|react-dom|(connected-)?react-router|history|react-router-dom|redux|@?redux-saga|react-redux|react-intl|react-helmet|reselect)[\\/]/,
    //       name: 'react',
    //       chunks: 'all',
    //       enforce: true,
    //     },
    //     main: {
    //       chunks: 'all',
    //       minChunks: 2,
    //       reuseExistingChunk: true,
    //     },
    //   },
    // },
    runtimeChunk: true,
  },

  plugins: [
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'src/index.html',
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

    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),

    // new WebpackPwaManifest({
    //   name: 'Registraties Amsterdam',
    //   short_name: 'Registraties Amsterdam',
    //   background_color: '#fafafa',
    //   theme_color: '#b1624d',
    //   inject: true,
    //   ios: true,
    //   icons: [
    //     {
    //       src: path.resolve('src/images/icon-512x512.png'),
    //       sizes: [72, 96, 128, 144, 192, 384, 512],
    //     },
    //     {
    //       src: path.resolve('src/images/icon-512x512.png'),
    //       sizes: [120, 152, 167, 180],
    //       ios: true,
    //     },
    //   ],
    // }),

    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),
  ],

  performance: {
    assetFilter: (assetFilename) =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },

  externals: {
    globalConfig: JSON.stringify(
      // eslint-disable-next-line global-require
      require(path.resolve(process.cwd(), 'environment.conf.prod.json')),
    ),
  },
});
