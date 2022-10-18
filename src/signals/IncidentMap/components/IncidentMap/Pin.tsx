// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { useEffect } from 'react'

import { Marker } from '@amsterdam/react-maps'
import type { LatLngLiteral, Map } from 'leaflet'

import { DEFAULT_ZOOM } from 'components/AreaMap/AreaMap'
import { markerIcon } from 'shared/services/configuration/map-markers'

export interface Props {
  map: Map
  coordinates: LatLngLiteral
}

export const Pin = ({ map, coordinates }: Props) => {
  useEffect(() => {
    map.flyTo(coordinates, DEFAULT_ZOOM)
  }, [map, coordinates])

  return (
    <Marker
      data-testid="incidentPinMarker"
      key={Object.values(coordinates).toString()}
      args={[coordinates]}
      options={{
        icon: markerIcon,
        keyboard: false,
      }}
    />
  )
}
