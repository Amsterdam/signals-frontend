// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
/* eslint-disable global-require */
import L from 'leaflet'

import select from '../../../shared/images/icon-select-marker.svg?url'
import incident from '../../../shared/images/icon-incident-marker.svg?url'
import pinRed from '../../../shared/images/area-map/icon-pin-red.svg?url'
import pinGreen from '../../../shared/images/area-map/icon-pin-green.svg?url'
import pin from '../../../shared/images/area-map/icon-pin.svg?url'
import cross from '../../../shared/images/area-map/icon-cross.svg?url'

export const smallMarkerIcon = L.icon({
  iconUrl: select,
  iconSize: [20, 20],
  iconAnchor: [10, 19],
  className: 'map-marker-select-small',
})

export const markerIcon = L.icon({
  iconUrl: select,
  iconSize: [40, 40],
  iconAnchor: [20, 39],
  className: 'map-marker-select',
})

export const incidentIcon = L.icon({
  iconUrl: incident,
  iconSize: [40, 40],
  iconAnchor: [20, 39],
  className: 'map-marker-incident',
})

export const pointerSelectIcon = L.icon({
  iconUrl: pinRed,
  iconAnchor: [16, 42],
})

const ANCHOR: L.PointExpression = [12, 32]

export const openIncidentIcon = L.icon({
  iconUrl: pin,
  iconAnchor: ANCHOR,
})

export const closedIncidentIcon = L.icon({
  iconUrl: pinGreen,
  iconAnchor: ANCHOR,
})

export const currentIncidentIcon = L.icon({
  iconUrl: cross,
  iconAnchor: [48, 48],
})
