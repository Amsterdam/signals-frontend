#!/bin/sh

export SIGNALS_CONFIG=$(cat /config.json | jq -c)
envsubst < /usr/share/nginx/html/index.html > /tmp/index.html
mv /tmp/index.html /usr/share/nginx/html/index.html

nginx -g "daemon off;"
