/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */

import { useEffect, useState } from 'react'

import type { Feature } from 'geojson'
import L from 'leaflet'

import MarkerCluster from 'components/MarkerCluster'
import {
  incidentIcon,
  markerIcon,
} from 'shared/services/configuration/map-markers'
import { featureToCoordinates } from 'shared/services/map-location'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import type { Point, Properties } from '../../types'

const clusterLayerOptions = {
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
}

interface Props {
  passBbox(bbox: Bbox): void
  incidents?: Feature<Point, Properties>[]
  resetMarkerIcons: () => void
  setShowDetailPanel: (incident: any) => void
}

/* istanbul ignore next */

export const IncidentLayer = ({
  passBbox,
  incidents,
  resetMarkerIcons,
  setShowDetailPanel,
}: Props) => {
  const [layerInstance, setLayerInstance] = useState<L.GeoJSON<Point>>()
  const bbox = useBoundingBox()

  useEffect(() => {
    if (bbox) {
      passBbox(bbox)
    }
  }, [bbox, passBbox])

  useEffect(() => {
    if (!incidents || !layerInstance) return

    incidents.forEach((incident) => {
      const latlng = featureToCoordinates(incident.geometry)
      const { name } = incident.properties.category

      const clusteredMarker = L.marker(latlng, {
        icon: incidentIcon,
        alt: name,
        keyboard: false,
      })

      /* istanbul ignore next */
      clusteredMarker.on(
        'click',
        (event: {
          target: { setIcon: (icon: L.Icon<L.IconOptions>) => void }
        }) => {
          resetMarkerIcons()

          event.target.setIcon(markerIcon)

          if (incident) {
            setShowDetailPanel(incident)
          }
        }
      )

      layerInstance.addLayer(clusteredMarker)
    })

    return () => {
      layerInstance.clearLayers()
    }
  }, [layerInstance, incidents, resetMarkerIcons, setShowDetailPanel])

  return (
    <MarkerCluster
      clusterOptions={clusterLayerOptions}
      setInstance={setLayerInstance}
    />
  )
}
