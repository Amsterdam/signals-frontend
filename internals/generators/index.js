/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const fs = require('fs');
const path = require('path');
const dpComponentGenerator = require('./ams-component');
const dpContainerGenerator = require('./ams-container');
const dpModelGenerator = require('./ams-model');

module.exports = plop => {
  plop.setGenerator('ams-component', dpComponentGenerator);
  plop.setGenerator('ams-container', dpContainerGenerator);
  plop.setGenerator('ams-model', dpModelGenerator);
  plop.addHelper('directory', comp => {
    try {
      fs.accessSync(path.join(__dirname, `../../src/containers/${comp}`), fs.F_OK);
      return `containers/${comp}`;
    } catch {
      return `components/${comp}`;
    }
  });
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
  plop.addHelper('hyphenCase', text => text
    .replace(/[^\dA-Za-z]+/g, '-')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/(\d)(\D)/g, '$1-$2')
    .replace(/(\D)(\d)/g, '$1-$2')
    .replace(/-+/g, '-')
    .toLowerCase());
};
