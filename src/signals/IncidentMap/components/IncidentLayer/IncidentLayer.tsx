/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { useEffect, useState } from 'react'

import L from 'leaflet'

import MarkerCluster from 'components/MarkerCluster'
import {
  incidentIcon,
  markerIcon,
} from 'shared/services/configuration/map-markers'
import { featureToCoordinates } from 'shared/services/map-location'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import type { Point, Incident } from '../../types'

const clusterLayerOptions = {
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
}

interface Props {
  incidents?: Incident[]
  passBbox(bbox: Bbox): void
  resetMarkerIcons: () => void
  handleIncidentSelect: (incident?: Incident) => void
}

/* istanbul ignore next */

export const IncidentLayer = ({
  incidents,
  passBbox,
  resetMarkerIcons,
  handleIncidentSelect,
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
            handleIncidentSelect(incident)
          }
        }
      )

      layerInstance.addLayer(clusteredMarker)
      handleIncidentSelect(undefined)
    })

    return () => {
      layerInstance.clearLayers()
    }
  }, [layerInstance, incidents, resetMarkerIcons, handleIncidentSelect])

  return (
    <MarkerCluster
      clusterOptions={clusterLayerOptions}
      setInstance={setLayerInstance}
    />
  )
}
