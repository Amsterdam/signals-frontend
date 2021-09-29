// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
const path = require('path')
const webpack = require('webpack')
const pkgDir = require('pkg-dir')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyPlugin = require('copy-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production'
const __rootdir = pkgDir.sync()

const esModules = [
  path.resolve(__rootdir, 'node_modules/@amsterdam/asc-assets'),
  path.resolve(__rootdir, 'node_modules/@amsterdam/asc-ui'),
]

module.exports = ({
  babelQuery,
  devtool,
  entry,
  mode,
  optimization,
  output,
  performance = {},
  plugins,
  tsLoaders,
}) => ({
  mode,
  entry,
  output: {
    path: path.resolve(__rootdir, 'build'),
    publicPath: '/',
    ...output,
  }, // Merge with env dependent settings
  optimization,
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: /node_modules/,
        include: [path.resolve(__rootdir, 'src'), ...esModules],
        use: {
          loader: 'babel-loader',
          options: babelQuery,
        },
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: tsLoaders,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) =>
                `${path.relative(path.dirname(resourcePath), context)}/`,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        issuer: /\.tsx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: {
                  removeViewBox: false,
                },
              },
            },
          },
          'url-loader',
        ],
      },
      {
        test: /\.svg$/,
        issuer: /\.(jsx?|sass|scss|css)$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Inline files smaller than 5 kB
              limit: 5 * 1024,
              noquotes: true,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                enabled: false,
                // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
                // Try enabling it in your environment by switching the config to:
                // enabled: true,
                // progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
            },
          },
        ],
        dependency: { not: ['url'] },
        type: 'javascript/auto',
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
      GIT_BRANCH: JSON.stringify(process.env.GIT_BRANCH) || 'dummy',
      BUILD_ENV: JSON.stringify(process.env.BUILD_ENV) || 'development',
    }),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contenthash].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),

    new CopyPlugin({
      patterns: [{ from: path.resolve(__rootdir, 'assets'), to: 'assets' }],
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
  ]
    .concat(plugins)
    .filter(Boolean),
  resolve: {
    modules: [path.resolve(__rootdir, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.react.js', '.ts', '.tsx'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
      types: path.resolve(__rootdir, 'src/types/'),
    },
  },
  devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance,
})
