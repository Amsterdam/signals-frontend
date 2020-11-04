// const ignoredFilter = require('./filter-ignored');
//
// const eslintFlags = '--max-warnings 0 --fix --cache --cache-location node_modules/.cache/eslint-cache/';
//
// module.exports = {
//   '*.{js,ts,tsx}': 'eslint'
// }

// let split = require('split');
const CLIEngine = require('eslint').CLIEngine;
const cli = new CLIEngine({});

module.exports = {
  '*.{js,ts,tsx}': files => {
    const lintFiles = [];
    files.forEach(file => { if (!cli.isPathIgnored(file)) lintFiles.push(file); });
    return `eslint ${lintFiles.join(' ')}`;
  },
};
