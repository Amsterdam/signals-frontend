const fs = require('fs');

const injectConfig = require('./helpers/inject-config');

const indexFile = '/usr/share/nginx/html/index.html';
const manifestFile = '/usr/share/nginx/html/manifest.json';
const [indexContent, manifestContent] = injectConfig([indexFile, manifestFile]);

fs.writeFileSync(indexFile, indexContent);
fs.writeFileSync(manifestFile, manifestContent);
