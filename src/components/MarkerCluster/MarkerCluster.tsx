// SPDX-License-Identifier: MPL-2.0
// Copyright (C)  - 2021 Gemeente Amsterdam
import type L from 'leaflet'
import type { Dispatch, FunctionComponent, SetStateAction } from 'react'
import React from 'react'
import { createLeafletComponent } from '@amsterdam/react-maps'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import 'leaflet.markercluster'

const MarkerClusterGroup = createLeafletComponent('markerClusterGroup')

interface MarkerClusterProps {
  clusterOptions: L.MarkerClusterGroupOptions
  setInstance: Dispatch<SetStateAction<L.GeoJSON | undefined>>
}

const MarkerCluster: FunctionComponent<MarkerClusterProps> = ({
  clusterOptions,
  setInstance,
}) =>
  (
    <MarkerClusterGroup
      setInstance={setInstance as Dispatch<SetStateAction<unknown>>}
      options={clusterOptions}
    />
  ) || null

export default MarkerCluster
