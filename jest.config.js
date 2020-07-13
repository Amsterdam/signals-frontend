module.exports = {
  collectCoverageFrom: [
    'src/*.js',
    'src/**/*.{js,jsx}',
    '!src/*.test.js',
    '!src/**/*.test.{js,jsx}',
    '!src/test/**/*.{js,jsx}',
    '!src/*/RbGenerated*/*.{js,jsx}',
    '!src/app.js',
    '!src/polyfills.js',
    '!src/global-styles.js',
    '!src/**/definitions/*',
  ],
  coverageThreshold: {
    global: {
      statements: 97.27,
      branches: 96.25,
      functions: 97.57,
      lines: 97.21,
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
    '<rootDir>/internals/testing/test-bundler.js',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testRegex: '.*\\.test\\.js$',
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
