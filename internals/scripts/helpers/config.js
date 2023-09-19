// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
const fs = require('fs')
const path = require('path')

const merge = require('lodash/merge')

const extendedConfigFileName = process.env.CONFIG || 'app.json'

const baseConfig = require('../../../app.base.json')
const extendedConfigFile = path.join(
  __dirname,
  '..',
  '..',
  '..',
  extendedConfigFileName
)
const extendedConfig = fs.existsSync(extendedConfigFile)
  ? require(extendedConfigFile)
  : {}
const config = merge({}, baseConfig, extendedConfig)

const piwik = config?.piwik?.id
  ? `<script type="text/javascript">
(function(window, document, dataLayerName, id) { 
  window[dataLayerName]=window[dataLayerName]||[],window[dataLayerName].push({start:(new Date).getTime(),event:"stg.start"});var scripts=document.getElementsByTagName('script')[0],tags=document.createElement('script');
function stgCreateCookie(a,b,c){var d="";if(c){var e=new Date;e.setTime(e.getTime()+24*c*60*60*1e3),d="; expires="+e.toUTCString()}document.cookie=a+"="+b+d+"; path=/"}
var isStgDebug=(window.location.href.match("stg_debug")||document.cookie.match("stg_debug"))&&!window.location.href.match("stg_disable_debug");stgCreateCookie("stg_debug",isStgDebug?1:"",isStgDebug?14:-1);
var qP=[];dataLayerName!=="dataLayer"&&qP.push("data_layer_name="+dataLayerName),isStgDebug&&qP.push("stg_debug");var qPString=qP.length>0?("?"+qP.join("&")):"";
tags.async=!0,tags.src="https://dap.amsterdam.nl/containers/"+id+".js"+qPString,scripts.parentNode.insertBefore(tags,scripts);
!function(a,n,i){a[n]=a[n]||{};for(var c=0;c<i.length;c++)!function(i){a[n][i]=a[n][i]||{},a[n][i].api=a[n][i].api||function(){var a=[].slice.call(arguments,0);"string"==typeof a[0]&&window[dataLayerName].push({event:n+"."+i+":"+a[0],parameters:[].slice.call(arguments,1)})}}(i[c])}(window,"ppms",["tm","cm"]);
})(window, document, 'dataLayer', '${config.piwik.id}');
</script>`
  : ''

const placeholders = {
  $SIGNALS_ANDROID_ICON: config.head.androidIcon,
  $SIGNALS_BACKGROUND_COLOR: config.head.backgroundColor,
  $SIGNALS_CONFIG: JSON.stringify(config),
  $SIGNALS_PIWIK_SCRIPT: piwik,
  $SIGNALS_FAVICON: config.head.favicon,
  $SIGNALS_IOS_ICON: config.head.iosIcon,
  $SIGNALS_SITE_TITLE: config.language.siteTitle,
  $SIGNALS_PWA_SHORT_TITLE: config.language.shortTitle,
  $SIGNALS_PWA_TITLE: config.language.title,
  $SIGNALS_STATUS_BAR_STYLE: config.head.statusBarStyle,
  $SIGNALS_THEME_COLOR: config.head.themeColor,
  $SIGNALS_ADDITIONAL_CODE_CSS: config.additionalCode.css,
  $SIGNALS_ADDITIONAL_CODE_JS: config.additionalCode.js,
}

const inject = (files) =>
  files.map((file) =>
    Object.entries(placeholders).reduce(
      (acc, [key, value]) => acc.replace(new RegExp(`\\${key}`, 'gm'), value),
      fs.readFileSync(file).toString()
    )
  )

module.exports = {
  baseConfig,
  config,
  inject,
}
