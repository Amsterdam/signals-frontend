/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */

import type { FC } from 'react'
import { useEffect, useState } from 'react'
import useBoundingBox, {
  Bbox,
} from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import L from 'leaflet'

import { featureToCoordinates } from 'shared/services/map-location'
import MarkerCluster from 'components/MarkerCluster'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import L from 'leaflet'
import { incidentIcon } from 'shared/services/configuration/map-markers'
import type { MarkerCluster as MarkerClusterType } from 'leaflet'

import type { Feature } from 'geojson'
import type { Point, Properties } from './IncidentMap'

/* istanbul ignore next */
const clusterLayerOptions = {
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
  iconCreateFunction: (cluster: MarkerClusterType) => {
    return new L.DivIcon({
      html: `<div><span>${cluster.getChildCount()}</span></div>`,
      className: 'marker-cluster large',
      iconSize: new L.Point(52, 52),
    })
  },
}

interface IncidentLayerProps {
  passBbox(bbox: Bbox): void
  incidents?: Feature<Point, Properties>[]
}

const IncidentLayer: FC<IncidentLayerProps> = ({ passBbox, incidents }) => {
  const [layerInstance, setLayerInstance] = useState<L.GeoJSON<Point>>()
  const bbox = useBoundingBox()

  useEffect(() => {
    if (!bbox) return
    passBbox(bbox)
  }, [bbox, passBbox])

  useEffect(() => {
    if (!layerInstance) return
  }, [layerInstance])

  useEffect(() => {
    if (!incidents || !layerInstance) return

    /* istanbul ignore next */
    incidents.forEach((incident) => {
      const latlng = featureToCoordinates(incident.geometry)
      const { name } = incident.properties.category

      const clusteredMarker = L.marker(latlng, {
        icon: incidentIcon,
        alt: name,
        keyboard: false,
      })

      layerInstance.addLayer(clusteredMarker)
    })

    return () => {
      layerInstance.clearLayers()
    }
  }, [layerInstance, incidents])

  return (
    <Fragment>
      <MarkerCluster
        clusterOptions={clusterLayerOptions}
        setInstance={setLayerInstance}
      />
    </Fragment>
  )
}
