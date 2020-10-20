module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  collectCoverageFrom: [
    'src/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/test/**/*.{js,jsx,ts,tsx}',
    '!src/*/RbGenerated*/*.{js,jsx,ts,tsx}',
    '!src/app.tsx',
    '!src/polyfills.{js,jsx,ts,tsx}',
    '!src/global-styles.{js,jsx,ts,tsx}',
    '!src/**/definitions/*',
    '!src/**/.*',
    '!src/sw-proxy*.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 98.86,
      branches: 95.95,
      functions: 98.46,
      lines: 98.88,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  modulePathIgnorePatterns: ['<rootDir>/internals/'],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$': '<rootDir>/internals/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/mocks/image.js',
  },
  setupFilesAfterEnv: [
    '<rootDir>/internals/testing/test-bundler.ts',
  ],
  transform: {
    '^.+\\.(ts(x?)|js)$': 'ts-jest',
  },
  testRegex: '.*\\.test\\.(js|ts(x?))$',
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
