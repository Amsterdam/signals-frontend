// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { useEffect } from 'react'

import { Marker } from '@amsterdam/react-maps'
import type { LatLngLiteral, Map } from 'leaflet'

import { useDeviceMode } from 'hooks/useDeviceMode'
import configuration from 'shared/services/configuration/configuration'
import { markerIcon } from 'shared/services/configuration/map-markers'
import type { DeviceMode } from 'types/device'

export interface Props {
  map: Map
  coordinates: LatLngLiteral
  mode: DeviceMode
  closeOverlay: () => void
}

export const Pin = ({ map, coordinates, mode, closeOverlay }: Props) => {
  const { isMobile } = useDeviceMode()

  useEffect(() => {
    if (isMobile(mode)) {
      closeOverlay()
    }
    map.flyTo(coordinates, configuration.map.optionsIncidentMap.flyToMaxZoom)
  }, [closeOverlay, coordinates, isMobile, map, mode])

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
