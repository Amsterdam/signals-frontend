// SPDX-License-Identifier: MPL-2.0
// Copyright (C)  - 2021 Gemeente Amsterdam
import { getCrsRd } from '@amsterdam/arm-core'
import L from 'leaflet'
import type {
  LatLngBoundsExpression,
  LatLngExpression,
  MapOptions,
} from 'leaflet'

import configuration from 'shared/services/configuration/configuration'

const mapOptions = configuration.map.options

const crsCodeToProjection: { [key: string]: L.CRS } = {
  'EPSG:28992': getCrsRd(),
  'EPSG:3857': L.CRS.EPSG3857,
  'EPSG:4326': L.CRS.EPSG4326,
}

const MAP_OPTIONS: MapOptions = {
  crs: crsCodeToProjection[mapOptions.crs],
  center: mapOptions.center as LatLngExpression,
  maxBounds: mapOptions.maxBounds as LatLngBoundsExpression,
  maxZoom: mapOptions.maxZoom,
  minZoom: mapOptions.minZoom,
  zoom: mapOptions.zoom,
  attributionControl: true,
  zoomControl: false,
  dragging: !('ontouchstart' in window), // Touch users should not drag by default. Set to true if the map is full-screen.
}

export default MAP_OPTIONS
