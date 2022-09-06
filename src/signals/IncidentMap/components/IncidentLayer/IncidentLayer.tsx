/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import type { FeatureCollection } from 'geojson'
import type { LatLngTuple } from 'leaflet'
import type { ReactElement } from 'react'

import { useFetch } from 'hooks'
import { useEffect, useState } from 'react'
import useBoundingBox, {
  Bbox,
} from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import L from 'leaflet'

import { featureToCoordinates } from 'shared/services/map-location'
import MarkerCluster from 'components/MarkerCluster'
import { incidentIcon } from 'shared/services/configuration/map-markers'
import type { MarkerCluster as MarkerClusterType } from 'leaflet'

type Point = {
  type: 'Point'
  coordinates: LatLngTuple
}

type Properties = {
  category: {
    name: string
  }
  created_at: string
}

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

const IncidentLayer = () => {
  const [mapMessage, setMapMessage] = useState<ReactElement | string>()
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
