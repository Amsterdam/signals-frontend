import type { LatLngTuple } from 'leaflet'

import configuration from 'shared/services/configuration/configuration'
import { pointWithinBounds } from 'shared/services/map-location'

/**
 * Returns map center location from query parameters (e.g. '?lat=4.122&lng=52.233')
 *
 * If unvailable or not within configuration bounds, returns configured map center
 */
const getMapCenter = (): LatLngTuple => {
  const params = new URL(window.location.href).searchParams

  const lat = Number(params.get('lat'))
  const lng = Number(params.get('lng'))

  if (!isNaN(lat) && !isNaN(lng) && pointWithinBounds([lat, lng])) {
    return [lat, lng]
  }

  return configuration.map.options.center as LatLngTuple
}

export default getMapCenter
