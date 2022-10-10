/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { useEffect, useState } from 'react'

import L from 'leaflet'

import MarkerCluster from 'components/MarkerCluster'
import { dynamicIcon } from 'shared/services/configuration/map-markers'
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
  handleCloseDetailPanel: () => void
}

/* istanbul ignore next */
export const IncidentLayer = ({
  incidents,
  passBbox,
  resetMarkerIcons,
  handleIncidentSelect,
  handleCloseDetailPanel,
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
      const { category, icon: categoryIcon } = incident.properties

      const marker = L.marker(latlng, {
        icon: dynamicIcon(categoryIcon),
        alt: category.name,
        keyboard: false,
      })

      /* istanbul ignore next */
      marker.on('click', () => {
        // TODO: Change icon on select. Also return icon on deselect or close detailPanel.

        if (incident) {
          handleIncidentSelect(incident)
        }
      })
      layerInstance.addLayer(marker)
    })

    return () => {
      handleCloseDetailPanel()
      layerInstance.clearLayers()
    }
  }, [
    layerInstance,
    incidents,
    resetMarkerIcons,
    handleIncidentSelect,
    handleCloseDetailPanel,
  ])

  return (
    <MarkerCluster
      clusterOptions={clusterLayerOptions}
      setInstance={setLayerInstance}
    />
  )
}
