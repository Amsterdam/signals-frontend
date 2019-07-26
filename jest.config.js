const L = require('leaflet-headless');

module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/test/**/*.{js,jsx}',
    '!src/*/RbGenerated*/*.{js,jsx}',
    '!src/app.js',
    '!src/global-styles.js',
    '!src/*/*/Loadable.{js,jsx}',
    '!src/**/definitions/*',
  ],
  coverageThreshold: {
    global: {
      statements: 84,
      branches: 83,
      functions: 80,
      lines: 84,
    },
  },
  globals: {
    L,
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$': '<rootDir>/internals/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/mocks/image.js',
  },
  setupFilesAfterEnv: ['<rootDir>/internals/testing/test-bundler.js', '@testing-library/react/cleanup-after-each'],
  setupFiles: ['raf/polyfill', 'url-polyfill'],
  testRegex: '.*\\.test\\.js$',
  coverageReporters: ['lcov'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
