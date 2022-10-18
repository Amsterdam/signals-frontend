import type { Map } from 'leaflet'

import { DEFAULT_ZOOM } from '../utils'

/**
 * To get a good user experience on mobile when using flyTo you want to zoom out to the default zoom when
 * the zoom exceeds the default zoom, and zoom to a set MIN_ZOOM when zoom it too small.
 */
export const getZoom = (map: Map) => {
  const currentZoom = map.getZoom()
  const MIN_ZOOM = 12

  const zoomOut = currentZoom > DEFAULT_ZOOM
  const zoomIn = currentZoom < MIN_ZOOM

  return zoomOut ? DEFAULT_ZOOM : zoomIn ? MIN_ZOOM : currentZoom
}
