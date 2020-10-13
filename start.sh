#!/bin/sh

set -e

node /internals/scripts/validate-config.js
node /internals/scripts/inject-config.js

# When the service worker is enabled inject the timestamp as version to make sure the worker is reloaded on a configuration change.
if [ -f /usr/share/nginx/html/sw.js ]; then
    export SIGNALS_SERVICE_WORKER_VERSION=$(date +"%Y-%m-%d %T")
    envsubst < /usr/share/nginx/html/sw.js > /tmp/sw.js
    mv /tmp/sw.js /usr/share/nginx/html/sw.js
fi

nginx -g "daemon off;"
