/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import type { MutableRefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import MarkerCluster from 'components/MarkerCluster'
import type { FeatureCollection, Point } from 'geojson'
import L from 'leaflet'
import {
  dynamicIcon,
  selectedMarkerIcon,
} from 'shared/services/configuration/map-markers'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import type { Incident, Properties } from '../../types'

const clusterLayerOptions = {
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
}

interface Props {
  handleIncidentSelect: (incident: Incident) => void
  incidents?: Incident[]
  passBbox(bbox: Bbox): void
  resetSelectedMarker: () => void
  selectedMarkerRef: MutableRefObject<L.Marker<Properties> | undefined>
}

/* istanbul ignore next */
export const IncidentLayer = ({
  handleIncidentSelect,
  incidents,
  passBbox,
  resetSelectedMarker,
  selectedMarkerRef,
}: Props) => {
  const [layerInstance, setLayerInstance] = useState<L.GeoJSON<Point>>()
  const activeLayer = useRef<L.GeoJSON>()
  const bbox = useBoundingBox()

  useEffect(() => {
    if (bbox) {
      passBbox(bbox)
    }
  }, [bbox, passBbox])

  useEffect(() => {
    if (!incidents || !layerInstance) return
    activeLayer.current?.remove()

    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: incidents,
    }

    layerInstance.clearLayers()

    const layer = L.geoJSON(fc, {
      onEachFeature: (feature: Incident, layer: L.Layer) => {
        layer.on('click', (e: { target: L.Marker<Properties> }) => {
          if (selectedMarkerRef.current !== e.target) {
            resetSelectedMarker()
          }

          e.target.setIcon(selectedMarkerIcon)
          selectedMarkerRef.current = e.target

          handleIncidentSelect(feature)
        })
      },
      pointToLayer: (incident: Incident, latlng) => {
        let marker = L.marker(latlng, {
          icon: dynamicIcon(incident.properties?.icon),
          alt: incident.properties.category.name,
          keyboard: false,
        })
        // Matching on created_at since incidents do not have an ID
        if (
          selectedMarkerRef.current?.feature?.properties.created_at ===
          incident.properties.created_at
        ) {
          marker = L.marker(latlng, {
            icon: selectedMarkerIcon,
            alt: incident.properties.category.name,
            keyboard: false,
          })
          selectedMarkerRef.current = marker
        }

        return marker
      },
    })

    layer.addTo(layerInstance)

    activeLayer.current = layer
  }, [
    handleIncidentSelect,
    incidents,
    layerInstance,
    resetSelectedMarker,
    selectedMarkerRef,
  ])

  const getIsSelectedCluster = useCallback(
    (cluster: L.MarkerCluster) => {
      const markers = cluster.getAllChildMarkers()

      // Matching on created_at since incidents do not have ID's
      return markers.some(
        (marker) =>
          marker.feature?.properties.created_at ===
          selectedMarkerRef.current?.feature?.properties.created_at
      )
    },
    [selectedMarkerRef]
  )

  return (
    <MarkerCluster
      clusterOptions={clusterLayerOptions}
      setInstance={setLayerInstance}
      getIsSelectedCluster={getIsSelectedCluster}
      spiderfySelectedCluster={false}
      keyboard={false}
    />
  )
}
