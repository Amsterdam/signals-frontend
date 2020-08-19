#!/bin/sh

set -e

node /internals/scripts/validate-schemas.js

export SIGNALS_SERVICE_WORKER_VERSION=$(date +"%Y-%m-%d %T")

export SIGNALS_CONFIG=$(cat /environment.conf.json | jq -c)
export SIGNALS_TRANSLATIONS=$(cat /translations.json | jq -c)
export SIGNALS_LANG=$(cat /translations.json | jq -r '.lang')

export SIGNALS_ANDROID_ICON=$(cat /environment.conf.json | jq -r '.head.androidIcon')
export SIGNALS_BACKGROUND_COLOR=$(cat /environment.conf.json | jq -r '.head.backgroundColor')
export SIGNALS_FAVICON=$(cat /environment.conf.json | jq -r '.head.favicon')
export SIGNALS_IOS_ICON=$(cat /environment.conf.json | jq -r '.head.iosIcon')
export SIGNALS_MANIFEST_SHORT_NAME=$(cat /translations.json | jq -r :"${SIGNALS_LANG}.translation.manifestShortName")
export SIGNALS_MANIFEST_NAME=$(cat /environment.conf.json | jq -r "${SIGNALS_LANG}.translation.manifestName")
export SIGNALS_SITE_TITLE=$(cat /environment.conf.json | jq -r "${SIGNALS_LANG}.translation.siteTitle")
export SIGNALS_MATOMO_SITE_ID=$(cat /environment.conf.json | jq -r '.matomo.siteId')
export SIGNALS_MATOMO_URL_BASE=$(cat /environment.conf.json | jq -r '.matomo.urlBase')
export SIGNALS_STATUS_BAR_STYLE=$(cat /environment.conf.json | jq -r '.head.statusBarStyle')
export SIGNALS_MANIFEST_THEME_COLOR=$(cat /environment.conf.json | jq -r '.head.manifestThemeColor')

envsubst < /usr/share/nginx/html/sw.js > /tmp/sw.js
envsubst "`printf '${%s} ' $(sh -c "env|cut -d'=' -f1")`" < /usr/share/nginx/html/index.html > /tmp/index.html
envsubst < /usr/share/nginx/html/manifest.json > /tmp/manifest.json

mv /tmp/sw.js /usr/share/nginx/html/sw.js
mv /tmp/index.html /usr/share/nginx/html/index.html
mv /tmp/manifest.json /usr/share/nginx/html/manifest.json

nginx -g "daemon off;"
