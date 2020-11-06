module.exports = {
  extends: ['plugin:jest/all'],
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.ts', 'src/test/utils.js', '**/*.spec.ts'],
      rules: {
      },
    },
  ],
};
