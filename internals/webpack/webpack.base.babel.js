const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devMode = process.env.NODE_ENV !== 'production';

module.exports = options => ({
  mode: options.mode,

  entry: ['@babel/polyfill', 'formdata-polyfill', 'url-polyfill', require.resolve('react-app-polyfill/ie11')].concat(
    options.entry
  ),

  // eslint-disable-next-line prefer-object-spread
  output: Object.assign(
    {
      path: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
    },
    options.output
  ), // Merge with env dependent settings
  optimization: options.optimization,

  module: {
    rules: [
      {
        test: /\.jsx?$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery,
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => `${path.relative(path.dirname(resourcePath), context)}/`,
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.svg$/,
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
      },
    ],
  },

  plugins: options.plugins_pre
    .concat([
      // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
      // inside your code for any environment checks; Terser will automatically
      // drop any unreachable code.
      new webpack.EnvironmentPlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        GIT_COMMIT: JSON.stringify(process.env.GIT_COMMIT) || 'dummy',
      }),

      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash].css',
        chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contenthash].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),

      process.env.ANALYZE && new BundleAnalyzerPlugin(),
    ])
    .concat(options.plugins_post)
    .filter(Boolean),

  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
  },

  devtool: options.devtool,

  target: 'web', // Make web variables accessible to webpack, e.g. window

  performance: options.performance || {},

  externals: {
    globalConfig: JSON.stringify(
      // eslint-disable-next-line
      require(path.resolve(process.cwd(), 'environment.conf.json'))
    ),
  },
});
