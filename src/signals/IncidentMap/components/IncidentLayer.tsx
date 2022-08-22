/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */

import type { FeatureCollection, Feature as GeoJSONFeature } from 'geojson'
import type { LatLngTuple } from 'leaflet'
import type { Geometrie } from 'types/incident'
import type { ReactElement } from 'react'

import { useFetch } from 'hooks'
import { useEffect, useState } from 'react'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import configuration from 'shared/services/configuration/configuration'
import L from 'leaflet'
import { Marker, ViewerContainer } from '@amsterdam/arm-core'
import { featureToCoordinates } from 'shared/services/map-location'
import { MapMessage } from 'signals/incident/components/form/MapSelectors/components/MapMessage'

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

type Feature = GeoJSONFeature<Point, Properties>

const IncidentLayer = () => {
  const [mapMessage, setMapMessage] = useState<ReactElement | string>()
  const bbox = useBoundingBox()
  const { get, data, error } = useFetch<FeatureCollection<Point, Properties>>()

  const getMarker = (feature: Feature) => {
    const coordinates = featureToCoordinates(feature.geometry as Geometrie)
    const icon = L.icon({
      iconSize: [24, 32],
      iconUrl: '/assets/images/area-map/icon-pin.svg',
    })
    const { name } = feature.properties.category
    const { created_at } = feature.properties

    return (
      <Marker
        key={created_at}
        options={{
          icon,
          alt: name,
          keyboard: false,
        }}
        latLng={coordinates}
      />
    )
  }

  useEffect(() => {
    if (error) setMapMessage('Er konden geen meldingen worden opgehaald.')
  }, [get])

  useEffect(() => {
    if (!bbox) return

    const { west, south, east, north } = bbox
    const searchParams = new URLSearchParams({
      bbox: `${west},${south},${east},${north}`,
    })

    get(`${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`)
  }, [get, bbox])

  return (
    <>
      <span data-testid="incidentLayer" />
      {data?.features.map((feature) => getMarker(feature))}
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
