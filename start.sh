#!/bin/sh

set -e

node /internals/scripts/validate-config.js
node /internals/scripts/inject-config.js

export SIGNALS_SERVICE_WORKER_VERSION=$(date +"%Y-%m-%d %T")
envsubst < /usr/share/nginx/html/sw.js > /tmp/sw.js
mv /tmp/sw.js /usr/share/nginx/html/sw.js

nginx -g "daemon off;"
