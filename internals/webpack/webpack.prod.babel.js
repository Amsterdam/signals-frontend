const path = require('path');
const pkgDir = require('pkg-dir');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const { HashedModuleIdsPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const template = require('./template');

const __rootdir = pkgDir.sync();

module.exports = require('./webpack.base.babel')({
  mode: 'production',

  entry: [path.join(process.cwd(), 'src/app.tsx')],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  tsLoaders: [
    // Babel also have typescript transpiler. Uncomment this if you prefer and comment-out ts-loader
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
        cache: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
    nodeEnv: 'production',
    namedChunks: true,
    namedModules: true,
    moduleIds: 'named',
    chunkIds: 'named',
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

    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),

    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
    process.env.ENABLE_SERVICEWORKER === '1' ? new OfflinePlugin({
      version: '$SIGNALS_SERVICE_WORKER_VERSION',
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
    }) : null,

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
    assetFilter: assetFilename => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
});
