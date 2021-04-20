// SPDX-License-Identifier: MPL-2.0
// Copyright (C)  - 2021 Gemeente Amsterdam
import { getCrsRd } from '@amsterdam/arm-core'
import type { MapOptions } from 'leaflet'

import configuration from 'shared/services/configuration/configuration'

const MAP_OPTIONS: MapOptions = {
  ...(configuration.map.options as MapOptions),
  attributionControl: true,
  crs: getCrsRd(),
  zoomControl: false,
  dragging: !('ontouchstart' in window), // Touch users should not drag by default. Set to true if the map is full-screen.
}

export default MAP_OPTIONS
