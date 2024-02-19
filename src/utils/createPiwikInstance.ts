import PiwikPro from '@piwikpro/react-piwik-pro'

const piwikUrl = 'https://dap.amsterdam.nl/containers/' // TODO: we should get this from the config
const piwikSiteId = 'e63312c0-0efe-4c4f-bba1-3ca1f05374a8' // TODO: we should get this from the config

let PiwikInstance = false

function createPiwikInstance(isEnabled = true) {
  if (!isEnabled || PiwikInstance) return

  if (!piwikUrl || !piwikSiteId) return

  PiwikPro.initialize(piwikSiteId, piwikUrl)
  PiwikInstance = true
}

export { createPiwikInstance }
