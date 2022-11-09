// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
/* eslint-disable global-require */
import L from 'leaflet'

export const smallMarkerIcon = L.icon({
  iconUrl: '/assets/images/icon-select-marker.svg',
  iconSize: [20, 20],
  iconAnchor: [10, 19],
  className: 'map-marker-select-small',
})

export const markerIcon = L.icon({
  iconUrl: '/assets/images/icon-select-marker.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 39],
  className: 'map-marker-select',
})

export const selectedMarkerIcon = L.icon({
  iconUrl: '/assets/images/feature-selected-marker.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 39],
})

export const incidentIcon = L.icon({
  iconUrl: '/assets/images/icon-incident-marker.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 39],
  className: 'map-marker-incident',
})

export const pointerSelectIcon = L.icon({
  iconUrl: '/assets/images/area-map/icon-pin-red.svg',
  iconAnchor: [16, 42],
})

const ANCHOR: L.PointExpression = [12, 32]

export const openIncidentIcon = L.icon({
  iconUrl: '/assets/images/area-map/icon-pin.svg',
  iconAnchor: ANCHOR,
})

export const closedIncidentIcon = L.icon({
  iconUrl: '/assets/images/area-map/icon-pin-green.svg',
  iconAnchor: ANCHOR,
})

export const currentIncidentIcon = L.icon({
  iconUrl: '/assets/images/area-map/icon-cross.svg',
  iconAnchor: [48, 48],
})

export const defaultIcon = '/assets/images/icon-incident-marker.svg'
export const dynamicIcon = (iconUrl?: string) =>
  L.icon({
    iconUrl: iconUrl ?? defaultIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 39],
    className: 'map-marker-incident',
  })
