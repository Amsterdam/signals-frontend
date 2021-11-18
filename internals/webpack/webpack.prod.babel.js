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
      // minSize: 25000,
      minChunks: 1,
      // maxAsyncRequests: 30,
      // maxInitialRequests: 30,
      // enforceSizeThreshold: 85000,
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        // vendors: {
        //   test: /[\\/]node_modules[\\/]/,
        //   chunks: 'initial',
        //   filename: 'vendors.[contenthash].js',
        //   priority: 1,
        //   // maxInitialRequests: 2,
        //   // minChunks: 3,
        //   reuseExistingChunk: true,
        // },
        vendor: {
          test: /[\\/]node_modules[\\/](?!@amsterdam)/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1]

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`
          },
        },
        amsterdam: {
          test: /[\\/]node_modules[\\/]@amsterdam/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/]@amsterdam[\\/](.*?)([\\/]|$)/
            )[1]

            return `npm.${packageName}`
          },
        },
        // react: {
        //   test: /(react-?(dom|router|redux|media)|redux)|react$/,
        //   chunks: 'all',
        //   filename: 'react.[contenthash].js',
        // },
        // amsterdam: {
        //   test: /@(amsterdam|datapunt)\/(?!asc-ui)/,
        //   chunks: 'all',
        //   filename: 'amsterdam.[contenthash].js',
        // },
        // leaflet: {
        //   test: /(leaflet|proj4)/,
        //   chunks: 'all',
        //   filename: 'leaflet.[contenthash].js',
        // },
        // core_js: {
        //   test: /core-js/,
        //   chunks: 'all',
        //   filename: 'core-js.[contenthash].js',
        // },
        // sentry: {
        //   test: /sentry/,
        //   chunks: 'all',
        //   filename: 'sentry.[contenthash].js',
        // },
        // asc_ui: {
        //   test: /@amsterdam[\\/]asc-ui/,
        //   chunks: 'all',
        //   filename: 'asc-ui.[contenthash].js',
        //   priority: 1,
        // },
        // asc_assets: {
        //   test: /@amsterdam[\\/]asc-assets/,
        //   chunks: 'all',
        //   filename: 'asc-assets.[contenthash].js',
        //   priority: 1,
        // },
        // styled: {
        //   test: /(styled|@emotion|polished)/,
        //   chunks: 'all',
        //   filename: 'styled.[contenthash].js',
        // },
        // lodash: {
        //   test: /lodash/,
        //   chunks: 'all',
        //   filename: 'lodash.[contenthash].js',
        // },
        // markdown: {
        //   test: /(markdown|micromarkproperty-information|mdast)/,
        //   chunks: 'all',
        //   filename: 'markdown.[contenthash].js',
        // },
        // legacy: {
        //   test: /(reactive-form|albus)/,
        //   chunks: 'all',
        //   filename: 'legacy.[contenthash].js',
        // },
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

module.exports = merge(baseConfig, productionConfig)
