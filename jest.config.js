const path = require('path');

module.exports = {
  collectCoverageFrom: [
    'src/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/test/**/*.{js,jsx,ts,tsx}',
    '!src/*/RbGenerated*/*.{js,jsx,ts,tsx}',
    '!src/app.{js,jsx,ts,tsx}',
    '!src/polyfills.{js,jsx,ts,tsx}',
    '!src/global-styles.{js,jsx,ts,tsx}',
    '!src/**/definitions/*',
    '!src/**/.*',
    '!src/sw-proxy*.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 99.02,
      branches: 97.90,
      functions: 98.86,
      lines: 99.05,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  modulePathIgnorePatterns: ['<rootDir>/internals/'],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$': '<rootDir>/internals/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/mocks/image.js',
  },
  setupFilesAfterEnv: ['<rootDir>/internals/testing/test-bundler.js'],
  transform: { '^.+\\.(js|ts(x?))$': ['ts-jest', { configFile: path.resolve(__dirname, 'babel.config.js') }] },
  testRegex: '.*\\.test\\.(js|ts(x?))$',
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
