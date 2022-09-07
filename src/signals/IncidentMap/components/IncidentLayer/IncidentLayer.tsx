/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */

import { Fragment, useEffect, useState } from 'react'

import type { Feature } from 'geojson'
import L from 'leaflet'

import MarkerCluster from 'components/MarkerCluster'
import { incidentIcon } from 'shared/services/configuration/map-markers'
import { featureToCoordinates } from 'shared/services/map-location'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import type { Point, Properties } from '../IncidentMap'

/* istanbul ignore next */
const clusterLayerOptions = {
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
}

interface Props {
  passBbox(bbox: Bbox): void
  incidents?: Feature<Point, Properties>[]
}

export const IncidentLayer = ({ passBbox, incidents }: Props) => {
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
