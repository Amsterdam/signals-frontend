/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const fs = require('fs');
const path = require('path');
const dpComponentGenerator = require('./ams-component/index.js');
const dpContainerGenerator = require('./ams-container/index.js');
const dpModelGenerator = require('./ams-model/index.js');

module.exports = plop => {
  plop.setGenerator('ams-component', dpComponentGenerator);
  plop.setGenerator('ams-container', dpContainerGenerator);
  plop.setGenerator('ams-model', dpModelGenerator);
  plop.addHelper('directory', comp => {
    try {
      fs.accessSync(path.join(__dirname, `../../src/containers/${comp}`), fs.F_OK);
      return `containers/${comp}`;
    } catch (e) {
      return `components/${comp}`;
    }
  });
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
  plop.addHelper('hyphenCase', text => text
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([0-9])([^0-9])/g, '$1-$2')
    .replace(/([^0-9])([0-9])/g, '$1-$2')
    .replace(/-+/g, '-')
    .toLowerCase());
};
