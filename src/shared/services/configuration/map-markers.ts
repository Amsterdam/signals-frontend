// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
/* eslint-disable global-require */
import L from 'leaflet'

import SelectIcon from '../../../shared/images/icon-select-marker.svg'
import IncidentIcon from '../../../shared/images/icon-incident-marker.svg'
import IconPinRed from '../../../shared/images/area-map/icon-pin-red.svg'
import IconPinGreen from '../../../shared/images/area-map/icon-pin-green.svg'
import IconPin from '../../../shared/images/area-map/icon-pin.svg'

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

export const pointerSelectIcon = L.icon({
  iconUrl: IconPinRed,
  iconAnchor: [16, 42],
})

const ANCHOR: L.PointExpression = [12, 32]

export const openIncidentIcon = L.icon({
  iconUrl: IconPin,
  iconAnchor: ANCHOR,
})

export const closedIncidentIcon = L.icon({
  iconUrl: IconPinGreen,
  iconAnchor: ANCHOR,
})
