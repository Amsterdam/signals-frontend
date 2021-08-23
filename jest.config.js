// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
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
      statements: 98.77,
      branches: 94.62,
      lines: 99.02,
      functions: 97.78,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.json',
  //   },
  // },
  moduleDirectories: ['node_modules', 'src', '<rootDir>/internals/'],
  // modulePathIgnorePatterns: ['<rootDir>/internals/', '<rootDir>/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$': '<rootDir>/internals/mocks/cssModule.js',
    '.*\\.svg$': '<rootDir>/internals/mocks/svg.ts',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/mocks/image.ts',
  },
  setupFilesAfterEnv: [
    '<rootDir>/internals/testing/test-bundler.js',
    '<rootDir>/internals/testing/jest-setup-msw.js',
  ],
  testEnvironment: 'jsdom',
  // transform: {
  // '^.+\\.(js|ts(x?))$': [
  //   'esbuild-jest',
  //   { configFile: path.resolve(__dirname, 'babel.config.js') },
  // ],
  // '^.+\\.(js|ts(x?))$': [
  //   'ts-jest',
  //   // { configFile: path.resolve(__dirname, 'babel.config.js') },
  // ],
  // },
  testRegex: '.*\\.test\\.(js|ts(x?))$',
  testTimeout: 10000,
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
