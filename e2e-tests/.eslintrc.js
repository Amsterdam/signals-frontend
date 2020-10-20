module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    overrides: [
        {
            env: { 'cypress/globals': true },
            files: ['cypress/**/*'],
            extends: ['plugin:cypress/recommended'],
            plugins: ['cypress'],
            rules: {
                'promise/always-return': 'off',
                'promise/catch-or-return': 'off',
            },
        },
    ],

    extends: [
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: { indent: ['error', 2, { SwitchCase: 1, MemberExpression: 1 }], },
};
