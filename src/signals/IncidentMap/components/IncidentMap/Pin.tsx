// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { useEffect } from 'react'

import { Marker } from '@amsterdam/react-maps'
import type { LatLngLiteral, Map } from 'leaflet'

import { DEFAULT_ZOOM } from 'components/AreaMap/AreaMap'
import { markerIcon } from 'shared/services/configuration/map-markers'

import type { DeviceMode } from '../DrawerOverlay/types'
import { isMobile } from '../DrawerOverlay/utils'

export interface Props {
  map: Map
  coordinates: LatLngLiteral
  mode: DeviceMode
  closeOverlay: () => void
}

export const Pin = ({ map, coordinates, mode, closeOverlay }: Props) => {
  useEffect(() => {
    if (isMobile(mode)) {
      closeOverlay()
    }
    map.flyTo(coordinates, DEFAULT_ZOOM)
  }, [closeOverlay, coordinates, map, mode])

  return (
    <Marker
      data-testid="incident-pin-marker"
      key={Object.values(coordinates).toString()}
      args={[coordinates]}
      options={{
        icon: markerIcon,
        keyboard: false,
        zIndexOffset: 999,
      }}
    />
  )
}
