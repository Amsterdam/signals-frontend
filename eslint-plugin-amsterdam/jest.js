module.exports = {
  extends: ['plugin:jest/all'],
  env: { 'jest/globals': true },
  overrides: [
    {
      files: ['**/*.test.{js,jsx,ts,tsx}', 'src/test/utils{js,jsx,ts,tsx}', '**/*.spec{js,jsx,ts,tsx}'],
      rules: {
      },
    },
  ],
};
