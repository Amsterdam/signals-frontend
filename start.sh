#!/bin/sh

set -e

node /internals/scripts/validate-config.js

export SIGNALS_SERVICE_WORKER_VERSION=$(date +"%Y-%m-%d %T")

export SIGNALS_CONFIG=$(cat /environment.conf.json | jq -c)

export SIGNALS_ANDROID_ICON=$(cat /environment.conf.json | jq -r '.head.androidIcon')
export SIGNALS_BACKGROUND_COLOR=$(cat /environment.conf.json | jq -r '.head.backgroundColor')
export SIGNALS_FAVICON=$(cat /environment.conf.json | jq -r '.head.favicon')
export SIGNALS_IOS_ICON=$(cat /environment.conf.json | jq -r '.head.iosIcon')
export SIGNALS_MATOMO_SITE_ID=$(cat /environment.conf.json | jq -r '.matomo.siteId')
export SIGNALS_MATOMO_URL_BASE=$(cat /environment.conf.json | jq -r '.matomo.urlBase')
export SIGNALS_PWA_SHORT_TITLE=$(cat /environment.conf.json | jq -r '.language.shortTitle')
export SIGNALS_PWA_TITLE=$(cat /environment.conf.json | jq -r '.language.title')
export SIGNALS_SITE_TITLE=$(cat /environment.conf.json | jq -r '.language.siteTitle')
export SIGNALS_STATUS_BAR_STYLE=$(cat /environment.conf.json | jq -r '.head.statusBarStyle')
export SIGNALS_THEME_COLOR=$(cat /environment.conf.json | jq -r '.head.themeColor')

envsubst "`printf '${%s} ' $(sh -c "env|cut -d'=' -f1")`" < /usr/share/nginx/html/index.html > /tmp/index.html
mv /tmp/index.html /usr/share/nginx/html/index.html

envsubst < /usr/share/nginx/html/manifest.json > /tmp/manifest.json
mv /tmp/manifest.json /usr/share/nginx/html/manifest.json

if [ -f /usr/share/nginx/html/sw.js ]; then
    envsubst < /usr/share/nginx/html/sw.js > /tmp/sw.js
    mv /tmp/sw.js /usr/share/nginx/html/sw.js
fi

nginx -g "daemon off;"
