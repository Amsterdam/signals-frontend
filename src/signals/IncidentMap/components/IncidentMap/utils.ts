// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { Map } from 'leaflet'
import configuration from 'shared/services/configuration/configuration'

/**
 * To get a good user experience on mobile when using flyTo you want to zoom out to a set MAX_ZOOM when
 * the zoom exceeds the default zoom, and zoom to a set MIN_ZOOM when zoom it too small.
 */
export const getFlyToZoom = (map: Map) => {
  const currentZoom = map.getZoom()
  const MIN_ZOOM = configuration.map.optionsIncidentMap.flyToMinZoom
  const MAX_ZOOM = configuration.map.optionsIncidentMap.flyToMaxZoom

  const aboveMaxZoom = currentZoom > MAX_ZOOM
  const BelowMinZoom = currentZoom < MIN_ZOOM

  return aboveMaxZoom ? MAX_ZOOM : BelowMinZoom ? MIN_ZOOM : currentZoom
}
