#!/bin/sh

set -e

node /internals/scripts/validate-config.js
node /internals/scripts/inject-config.js

nginx -g "daemon off;"
