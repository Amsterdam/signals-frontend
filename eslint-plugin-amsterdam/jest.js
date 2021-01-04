module.exports = {
  extends: ['plugin:jest/all'],
  env: { 'jest/globals': true },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.ts', 'src/test/utils.js', '**/*.spec.ts'],
      rules: {
      },
    },
  ],
};
