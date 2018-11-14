#!/usr/bin/env bash

set -u
set -e
set -x

echo Building $1

echo Build distribution of this branch
export NODE_ENV=test

rm -rf node_modules
# No need to install Cypress for it is not being used here
CYPRESS_SKIP_BINARY_INSTALL=1 npm install
npm run build:acc

echo Publish distribution in web-dir
OUTDIR=/var/www/html/signals-frontend/builds/$1
if [ ! -d ${OUTDIR} ];
	then mkdir -p ${OUTDIR};
fi
cp -r dist/* ${OUTDIR}

echo Generate new index.html for all branches
echo '<h1>signals-frontend links</h1>' > /var/www/html/signals-frontend/index.html
echo "<h2>Generated at `date`</h2>" >> /var/www/html/signals-frontend/index.html
find /var/www/html/signals-frontend -name index.html -printf "%T+\t%p\n" | sort -r | grep 'signals-frontend' | sed 's/^.*\/signals-frontend/\/signals-frontend/' | sed 's/\/index.html//' | sed 's/^.*$/<p><a href="\0">\0<\/a><p>/' >> /var/www/html/signals-frontend/index.html
echo Done
