// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
const path = require('path')
const pkgDir = require('pkg-dir')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')

const template = require('./template')

const __rootdir = pkgDir.sync()

module.exports = require('./webpack.base.babel')({
  mode: 'production',

  entry: [path.join(process.cwd(), 'src/app.js')],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  tsLoaders: [
    // Babel also has a typescript transpiler. Uncomment this if you prefer and comment-out ts-loader
    // { loader: 'babel-loader' },
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true, // fork-ts-checker-webpack-plugin is used for type checking
        logLevel: 'info',
      },
    },
  ],

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
          keep_fnames: true,
        },
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
    nodeEnv: 'production',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'async',
      minSize: 25000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 85000,
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

    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),

    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
    process.env.ENABLE_SERVICEWORKER === '1'
      ? new GenerateSW({
          mode: 'production',
          swDest: 'sw.js',
          clientsClaim: true,
          skipWaiting: true,
          sourcemap: true,
          inlineWorkboxRuntime: true,
          exclude: [
            // Don't pre-cache any font files or images; we need a more fine-grained caching strategy (see below in runtimeCaching)
            /.+\.(?:woff|woff2|eot|ttf)$/,
            /.+\.(?:png|jpg|jpeg|svg|webp)$/,
            /.*\.(?:html|map|txt|htaccess)$/,
          ],
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 2.4 * 1000 * 1024,
        })
      : null,

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__rootdir, 'src', 'manifest.json'),
          to: path.resolve(__rootdir, 'build', 'manifest.json'),
        },
      ],
    }),
  ].filter(Boolean),

  performance: {
    assetFilter: (assetFilename) =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
})
