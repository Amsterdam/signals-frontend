import { useCallback, useState } from 'react'

import PiwikPro, { PageViews } from '@piwikpro/react-piwik-pro'

const piwikUrl = 'https://dap.amsterdam.nl/containers/' // TODO: we should get this from the config
const piwikSiteId = 'e63312c0-0efe-4c4f-bba1-3ca1f05374a8' // TODO: we should get this from the config

let PiwikInstance = false

function createPiwikInstance(isEnabled = true) {
  if (!isEnabled || PiwikInstance) return

  if (!piwikUrl || !piwikSiteId) {
    // TODO: notify developers via monitoring tool.
    console.error(
      'No Piwik URL or site ID provided. Please, either disable Piwik instantiation for this environment or include a URL and ID as an environment variable.'
    )

    return
  }

  PiwikPro.initialize(piwikSiteId, piwikUrl)
  PiwikInstance = true
}

function useAnalytics() {
  const [prevLocation, setPrevLocation] = useState('')

  const trackPageVisit = useCallback(
    (message?: string) => {
      let path = window?.location.href.split(/[?#]/)[0]

      if (!path.endsWith('/')) path = `${path}/`

      if (!PiwikInstance || !path) return
      if (prevLocation === path) return

      setPrevLocation(path)

      // eslint-disable-next-line no-console
      console.info(`Track page view to: ${message ?? path}`)

      PageViews.trackPageView(message ?? path)
    },
    [prevLocation]
  )

  return { trackPageVisit }
}

export { createPiwikInstance }
export default useAnalytics
