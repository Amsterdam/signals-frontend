/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */

import type { FC } from 'react'
import type { FeatureCollection } from 'geojson'
import { useEffect, useState } from 'react'
import { featureToCoordinates } from 'shared/services/map-location'
import MarkerCluster from 'components/MarkerCluster'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import L from 'leaflet'
import { incidentIcon } from 'shared/services/configuration/map-markers'
import type { Point, Properties } from './IncidentMap'

/* istanbul ignore next */
const clusterLayerOptions = {
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
}

interface IncidentLayerProps {
  passBbox(bbox: Bbox): void
  incidentData?: FeatureCollection<Point, Properties>
}

const IncidentLayer: FC<IncidentLayerProps> = ({ passBbox, incidentData }) => {
  const [layerInstance, setLayerInstance] = useState<L.GeoJSON<Point>>()
  const bbox = useBoundingBox()

  useEffect(() => {
    if (!bbox) return
    passBbox(bbox)
  }, [bbox])

  useEffect(() => {
    if (!layerInstance) return
  }, [layerInstance])

  useEffect(() => {
    if (!incidentData?.features || !layerInstance) return

    /* istanbul ignore next */
    incidentData.features.forEach((feature) => {
      const latlng = featureToCoordinates(feature.geometry)
      const { name } = feature.properties.category

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
  }, [layerInstance, incidentData])

  return (
    <>
      <span data-testid="incidentLayer" />
      <MarkerCluster
        clusterOptions={clusterLayerOptions}
        setInstance={setLayerInstance}
      />
    </>
  )
}

export default IncidentLayer
