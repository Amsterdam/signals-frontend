// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
/* eslint-disable global-require */
import L from 'leaflet'
import SelectIcon from '!!file-loader!../../../shared/images/icon-select-marker.svg' // `-marker` suffix ensures the svg is imported as url
import IncidentIcon from '!!file-loader!../../../shared/images/icon-incident-marker.svg' // `-marker` suffix ensures the svg is imported as url

export const smallMarkerIcon = L.icon({
  iconUrl: SelectIcon,
  iconSize: [20, 20],
  iconAnchor: [10, 19],
  className: 'map-marker-select-small',
})

export const markerIcon = L.icon({
  iconUrl: SelectIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 39],
  className: 'map-marker-select',
})

export const incidentIcon = L.icon({
  iconUrl: IncidentIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 39],
  className: 'map-marker-incident',
})
