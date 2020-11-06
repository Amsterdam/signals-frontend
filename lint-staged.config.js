module.exports = {
  '*.{js,ts,tsx}': files => {
    const mainFiles = [];
    const e2eTestingFiles = [];

    files.forEach(file => {
      if (file.match(/\/e2e-tests\/cypress\//)) {
        e2eTestingFiles.push(file);
      } else {
        mainFiles.push(file);
      }
    });

    return [
      `eslint ${mainFiles.join(' ')}`,
      `./e2e-tests/node_modules/.bin/eslint ${e2eTestingFiles.join(' ')}`,
    ];
  },
};
