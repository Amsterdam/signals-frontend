// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
const path = require('path')

module.exports = {
  coverageProvider: 'v8',
  maxWorkers: 2,
  // collectCoverageFrom: [
  //   'src/*.{js,jsx,ts,tsx}',
  //   'src/**/*.{js,jsx,ts,tsx}',
  //   '!src/*.test.{js,jsx,ts,tsx}',
  //   '!src/**/*.test.{js,jsx,ts,tsx}',
  //   '!src/test/**/*.{js,jsx,ts,tsx}',
  //   '!src/*/RbGenerated*/*.{js,jsx,ts,tsx}',
  //   '!src/app.{js,jsx,ts,tsx}',
  //   '!src/polyfills.{js,jsx,ts,tsx}',
  //   '!src/global-styles.{js,jsx,ts,tsx}',
  //   '!src/**/definitions/*',
  //   '!src/**/.*',
  //   '!src/sw-proxy*.{js,jsx,ts,tsx}',
  // ],
  // coverageThreshold: {
  //   global: {
  //     statements: 98.77,
  //     branches: 94.62,
  //     lines: 98.92,
  //     functions: 97.78,
  //   },
  // },
  // coverageReporters: process.env.CI ? ['text'] : ['lcov'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleDirectories: ['node_modules', 'src'],
  modulePathIgnorePatterns: ['<rootDir>/internals/', '<rootDir>/dist/'],
  moduleNameMapper: {
    '.*\\.css$': '<rootDir>/internals/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/mocks/image.ts',
  },
  setupFiles: ['<rootDir>/internals/testing/jest.polyfills.ts'],
  setupFilesAfterEnv: [
    '<rootDir>/internals/testing/test-bundler.ts',
    '<rootDir>/internals/testing/jest-setup-msw.ts',
  ],
  testTimeout: 10000,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  transform: {
    '^.+\\.(j|t)s(x?)$': [
      'babel-jest',
      { configFile: path.resolve(__dirname, 'babel.config.js') },
    ],
  },
  testRegex: '.*\\.test\\.(js|ts(x?))$',
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
