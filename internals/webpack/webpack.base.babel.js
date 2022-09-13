// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
// @ts-check
const path = require('path')

const CopyPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const isArray = require('lodash/isArray')
const mergeWith = require('lodash/mergeWith')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const pkgDir = require('pkg-dir')
const webpack = require('webpack')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const devMode = process.env.NODE_ENV !== 'production'
const __rootdir = pkgDir.sync()

const esModules = [
  path.resolve(__rootdir, 'node_modules/@amsterdam/asc-assets'),
  path.resolve(__rootdir, 'node_modules/@amsterdam/asc-ui'),
  path.resolve(__rootdir, 'node_modules/@amsterdam/arm-core'),
  path.resolve(__rootdir, 'node_modules/@amsterdam/react-maps'),
]

const mergeCustomizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

const baseConfig = /** @type { import('webpack').Configuration } */ {
  output: {
    path: path.resolve(__rootdir, 'build'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: /node_modules/,
        include: [path.resolve(__rootdir, 'src'), ...esModules],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) =>
                `${path.relative(path.dirname(resourcePath), context)}/`,
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2|jpg|png|gif)$/,
        type: 'asset',
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: 'svg-url-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
        type: 'javascript/auto',
      },
    ],
  },

  plugins: [
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; Terser will automatically
    // drop any unreachable code.
    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      PROXY: JSON.stringify(process.env.PROXY) || false,
      FRONTEND_TAG: JSON.stringify(process.env.FRONTEND_TAG) || 'dummy',
      DOMAIN_TAG: JSON.stringify(process.env.DOMAIN_TAG) || 'dummy',
      BUILD_ENV: JSON.stringify(process.env.BUILD_ENV) || 'development',
    }),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contenthash].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
      /*
      Chunks aren't split properly for CSS when using mini-css-extract-plugin
      Solution is found at https://github.com/koggdal/sample-mini-css-extract-plugin-issue-850
      */
      experimentalUseImportModule: false,
    }),

    new CopyPlugin({
      patterns: [
        { from: path.resolve(__rootdir, 'assets'), to: 'assets' },
        { from: path.resolve(__rootdir, 'src/images') },
      ],
    }),

    process.env.ANALYZE && new BundleAnalyzerPlugin(),

    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          syntactic: true,
          semantic: true,
          declaration: false,
          global: false,
        },
      },
    }),
  ].filter(Boolean),

  resolve: {
    modules: [path.resolve(__rootdir, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.react.js', '.ts', '.tsx'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
      types: path.resolve(__rootdir, 'src/types/'),
    },
  },

  target: 'web', // Make web variables accessible to webpack, e.g. window

  stats: 'normal',
}

module.exports = {
  baseConfig,
  merge: (objValue, srcValue) => mergeWith(objValue, srcValue, mergeCustomizer),
}
