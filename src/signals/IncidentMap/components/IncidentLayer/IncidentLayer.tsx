/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { useEffect, useRef, useState } from 'react'

import type { FeatureCollection, Point } from 'geojson'
import L from 'leaflet'

import MarkerCluster from 'components/MarkerCluster'
import {
  dynamicIcon,
  selectedMarkerIcon,
} from 'shared/services/configuration/map-markers'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import type { Incident } from '../../types'

const clusterLayerOptions = {
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
}
const emptyFeatureCollection = (): FeatureCollection => ({
  type: 'FeatureCollection',
  features: [],
})

interface Props {
  handleIncidentSelect: (incident: Incident) => void
  incidents?: Incident[]
  passBbox(bbox: Bbox): void
  resetMarkerIcon: () => void
  selectedMarkerRef: React.MutableRefObject<L.Marker<Incident> | undefined>
}

/* istanbul ignore next */
export const IncidentLayer = ({
  handleIncidentSelect,
  incidents,
  passBbox,
  resetMarkerIcon,
  selectedMarkerRef,
}: Props) => {
  const [layerInstance, setLayerInstance] = useState<L.GeoJSON<Point>>()
  const activeLayer = useRef<L.GeoJSON>()
  const bbox = useBoundingBox()

  useEffect(() => {
    if (bbox) {
      passBbox(bbox)
      resetMarkerIcon()
    }
  }, [bbox, passBbox, resetMarkerIcon])

  useEffect(() => {
    if (!incidents || !layerInstance) return
    activeLayer.current?.remove()
    const fc = emptyFeatureCollection()

    fc.features = incidents
    layerInstance.clearLayers()

    const layer = L.geoJSON(fc, {
      onEachFeature: (feature: Incident, layer: L.Layer) => {
        layer.on('click', (e: { target: L.Marker<Incident> }) => {
          if (
            selectedMarkerRef.current !== e.target &&
            selectedMarkerRef.current
          ) {
            resetMarkerIcon()
          }

          e.target.setIcon(selectedMarkerIcon)
          selectedMarkerRef.current = e.target

          handleIncidentSelect(feature)
        })
      },
      pointToLayer: (incident: Incident, latlng) => {
        if (selectedMarkerRef.current) {
          resetMarkerIcon()
        }

        const marker = L.marker(latlng, {
          icon: dynamicIcon(incident.properties?.icon),
          alt: incident.properties?.category.name,
          keyboard: false,
        })

        return marker
      },
    })

    layer.addTo(layerInstance)

    activeLayer.current = layer
  }, [
    handleIncidentSelect,
    incidents,
    layerInstance,
    resetMarkerIcon,
    selectedMarkerRef,
  ])

  return (
    <MarkerCluster
      clusterOptions={clusterLayerOptions}
      setInstance={setLayerInstance}
    />
  )
}
