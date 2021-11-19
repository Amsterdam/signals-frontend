// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
// @ts-check
const path = require('path')
const pkgDir = require('pkg-dir')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const __rootdir = pkgDir.sync()

const template = require('./template')
const { baseConfig, merge } = require('./webpack.base.babel')

const productionConfig = /** @type { import('webpack').Configuration } */ {
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
    moduleIds: 'deterministic',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minChunks: 1,
      minSize: 15000,
      cacheGroups: {
        vendor: {
          // Capture each package name and turn it into a cache group
          // See https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758 for reference on the benefits
          // of splitting the bundle like that.
          test: /[\\/]node_modules[\\/](?!@amsterdam)/,
          name(module) {
            const [, packageName] = module.context.match(
              /[\\/]node_modules[\\/](.*?)(?:[\\/]|$)/
            )

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`
          },
          priority: 0,
        },
        // Split the @amsterdam packages into separate chunks instead of packing everthing together; their combined size is over 500 Kb
        amsterdam: {
          test: /[\\/]node_modules[\\/]@amsterdam/,
          name(module) {
            const [, packageName] = module.context.match(
              /[\\/]node_modules[\\/]@amsterdam[\\/](.*?)(?:[\\/]|$)/
            )

            return `npm.${packageName}`
          },
          priority: 0,
        },
        leaflet: {
          test: /(leaflet|proj4)/,
          chunks: 'all',
          filename: 'leaflet.[contenthash].js',
          priority: 1,
        },
        legacy: {
          test: /(reactive-form|albus)/,
          chunks: 'all',
          filename: 'legacy.[contenthash].js',
          priority: 1,
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

    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__rootdir, 'src', 'manifest.json'),
          to: path.resolve(__rootdir, 'build', 'manifest.json'),
        },
      ],
    }),
  ],

  performance: {
    assetFilter: (assetFilename) =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
}

const stats = process.env.STATS

if (stats) productionConfig.stats = stats

module.exports = merge(baseConfig, productionConfig)
