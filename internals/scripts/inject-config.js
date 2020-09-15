const fs = require('fs');

const { inject } = require('./helpers/config');

const indexFile = '/usr/share/nginx/html/index.html';
const manifestFile = '/usr/share/nginx/html/manifest.json';
const [indexContent, manifestContent] = inject([indexFile, manifestFile]);

fs.writeFileSync(indexFile, indexContent);
fs.writeFileSync(manifestFile, manifestContent);
