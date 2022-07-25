// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { StyledMap } from 'signals/incident/components/form/MapSelectors/Asset/Selector/styled'
import type { LatLngTuple, MapOptions } from 'leaflet'
import { useLayoutEffect, useMemo, useState } from 'react'
import type { Map as MapType } from 'leaflet'
import MAP_OPTIONS from '../../../shared/services/configuration/map-options'
import { MAP_LOCATION_ZOOM } from '../../incident/components/form/MapSelectors/Asset/Selector/Selector'
import configuration from '../../../shared/services/configuration/configuration'

const IncidentMap = () => {
  const [map, setMap] = useState<MapType>()

  const coordinates = undefined

  const center =
    coordinates || (configuration.map.options.center as LatLngTuple)

  const mapOptions: MapOptions = useMemo(
    () => ({
      minZoom: 7,
      maxZoom: 16,
      ...MAP_OPTIONS,
      center,
      dragging: true,
      zoomControl: false,
      scrollWheelZoom: true,
      zoom: coordinates
        ? Math.min(
            MAP_LOCATION_ZOOM,
            MAP_OPTIONS.maxZoom || Number.POSITIVE_INFINITY
          )
        : MAP_OPTIONS.zoom,
    }),
    [center, coordinates]
  )

  useLayoutEffect(() => {
    if (!map || !coordinates) return

    const zoomLevel = mapOptions.zoom
      ? Math.max(map.getZoom(), mapOptions.zoom)
      : map.getZoom()

    map.flyTo(coordinates, zoomLevel)
  }, [coordinates, map, mapOptions.zoom])

  return (
    <>
      <div style={{ width: '800px', height: '500px' }}>
        <StyledMap mapOptions={mapOptions} setInstance={setMap}></StyledMap>
      </div>
      <div>hier kan de kaart komen</div>
    </>
  )
}

export default IncidentMap

// const { mapActive } = useSelector(makeSelectIncidentContainer)
