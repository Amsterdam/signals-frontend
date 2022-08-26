/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import type { FeatureCollection } from 'geojson'
import type { LatLngTuple } from 'leaflet'
import type { ReactElement, Dispatch, SetStateAction } from 'react'

import { useFetch } from 'hooks'
import { useEffect, useState } from 'react'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import configuration from 'shared/services/configuration/configuration'
import L from 'leaflet'

import { ViewerContainer } from '@amsterdam/arm-core'
import { featureToCoordinates } from 'shared/services/map-location'
import { MapMessage } from 'signals/incident/components/form/MapSelectors/components/MapMessage'
import MarkerCluster from 'components/MarkerCluster'
import { incidentIcon } from 'shared/services/configuration/map-markers'

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
}

const IncidentLayer = () => {
  const [mapMessage, setMapMessage] = useState<ReactElement | string>()
  const [layerInstance, setLayerInstance] = useState<L.LayerGroup>()

  const bbox = useBoundingBox()
  const { get, data, error } = useFetch<FeatureCollection<Point, Properties>>()

  useEffect(() => {
    if (!bbox) return

    const { west, south, east, north } = bbox
    const searchParams = new URLSearchParams({
      bbox: `${west},${south},${east},${north}`,
    })

    get(`${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`)
  }, [get, bbox])

  useEffect(() => {
    if (error) {
      setMapMessage('Er konden geen meldingen worden opgehaald.')
      return
    }

    if (!data?.features || !layerInstance) return

    /* istanbul ignore next */
    data.features.forEach((feature) => {
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
  }, [setMapMessage, layerInstance, data, error])

  return (
    <>
      <span data-testid="incidentLayer" />
      <MarkerCluster
        clusterOptions={clusterLayerOptions}
        setInstance={setLayerInstance as Dispatch<SetStateAction<unknown>>}
      />
      {mapMessage && (
        <ViewerContainer
          topLeft={
            <MapMessage onClick={() => setMapMessage('')}>
              {mapMessage}
            </MapMessage>
          }
        />
      )}
    </>
  )
}

export default IncidentLayer
