#!/bin/sh

export SIGNALS_CONFIG=$(cat /environment.conf.json | jq -c)

export SIGNALS_ANDROID_ICON=$(cat /environment.conf.json | jq -r '.meta.androidIcon')
export SIGNALS_BACKGROUND_COLOR=$(cat /environment.conf.json | jq -r '.meta.backgroundColor')
export SIGNALS_FAVICON=$(cat /environment.conf.json | jq -r '.meta.favicon')
export SIGNALS_IOS_ICON=$(cat /environment.conf.json | jq -r '.meta.iosIcon')
export SIGNALS_PWA_SHORT_TITLE=$(cat /environment.conf.json | jq -r '.language.shortTitle')
export SIGNALS_PWA_TITLE=$(cat /environment.conf.json | jq -r '.language.title')
export SIGNALS_SITE_TITLE=$(cat /environment.conf.json | jq -r '.language.siteTitle')
export SIGNALS_STATUS_BAR_STYLE=$(cat /environment.conf.json | jq -r '.meta.statusBarStyle')
export SIGNALS_THEME_COLOR=$(cat /environment.conf.json | jq -r '.meta.themeColor')

envsubst < /usr/share/nginx/html/index.html > /tmp/index.html
envsubst < /usr/share/nginx/html/manifest.json > /tmp/manifest.json

mv /tmp/index.html /usr/share/nginx/html/index.html
mv /tmp/manifest.json /usr/share/nginx/html/manifest.json

nginx -g "daemon off;"
