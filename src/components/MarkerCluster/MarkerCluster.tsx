// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import type { Dispatch, FunctionComponent, SetStateAction } from 'react'

import { createLeafletComponent } from '@amsterdam/react-maps'
import * as L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import './style.css'

import 'leaflet.markercluster'

const SELECTED_CLASS_MODIFIER = '--selected'
const CLUSTER_ICON_SIZE = 40
const MarkerClusterGroup = createLeafletComponent('markerClusterGroup')

interface MarkerClusterProps {
  setInstance: Dispatch<SetStateAction<L.GeoJSON | undefined>>
  clusterOptions?: L.MarkerClusterGroupOptions
  getIsSelectedCluster?: (cluster: L.MarkerCluster) => boolean
  spiderfySelectedCluster?: boolean
}

const MarkerCluster: FunctionComponent<MarkerClusterProps> = ({
  clusterOptions,
  setInstance,
  getIsSelectedCluster,
  spiderfySelectedCluster = true,
}) => {
  const options: L.MarkerClusterGroupOptions = {
    showCoverageOnHover: false,
    iconCreateFunction: /* istanbul ignore next */ (cluster) => {
      let className = 'marker-cluster'

      if (getIsSelectedCluster) {
        const isSelectedCluster = getIsSelectedCluster(cluster)

        if (isSelectedCluster) {
          className += ` ${className}${SELECTED_CLASS_MODIFIER}`
        }
        cluster.options.keyboard = false

        cluster.on({
          add: () => {
            // When selecting a marker in a cluster, re-render the cluster in spiderfied state
            if (isSelectedCluster && spiderfySelectedCluster) {
              ;(cluster as any)?.spiderfy()
            }
          },
        })
      }

      return new L.DivIcon({
        html: `<div><span>${cluster.getChildCount()}</span></div>`,
        className,
        iconSize: new L.Point(CLUSTER_ICON_SIZE, CLUSTER_ICON_SIZE),
      })
    },
    ...clusterOptions,
  }

  return (
    <MarkerClusterGroup
      setInstance={setInstance as Dispatch<SetStateAction<unknown>>}
      options={options}
    />
  )
}

export default MarkerCluster
