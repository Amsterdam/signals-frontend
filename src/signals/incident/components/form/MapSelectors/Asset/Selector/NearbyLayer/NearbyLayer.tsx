/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2021 - 2022 Gemeente Amsterdam */

import L from 'leaflet'
import type { FC } from 'react'
import { useFetch } from 'hooks'
import './style.css'

import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { FeatureCollection, Feature } from 'geojson'
import intersection from 'lodash/intersection'

import { makeSelectCategory } from 'signals/incident/containers/IncidentContainer/selectors'
import configuration from 'shared/services/configuration/configuration'

import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import useLayerVisible from 'signals/incident/components/form/MapSelectors/hooks/useLayerVisible'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import type { LatLngTuple, LeafletMouseEvent } from 'leaflet'
import type { Item } from 'signals/incident/components/form/MapSelectors/types'
import { NEARBY_TYPE } from 'signals/incident/components/form/MapSelectors/constants'

import reverseGeocoderService from 'shared/services/reverse-geocoder'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import { featureToCoordinates } from 'shared/services/map-location'

import { useMapInstance } from '@amsterdam/react-maps'
import type { Location } from 'types/incident'
import WfsDataContext from '../WfsLayer/context'
import { formattedDate } from '../utils'

// Custom Point type, because the compiler complains about the coordinates type
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

type NearbyMarker = L.Marker<Properties>

interface MarkerMouseEvent extends LeafletMouseEvent {
  sourceTarget: NearbyMarker
}

interface NearbyLayerProps {
  zoomLevel: ZoomLevel
}

export const nearbyMarkerIcon = L.icon({
  iconSize: [24, 32],
  iconUrl: '/assets/images/area-map/icon-pin.svg',
})

export const nearbyMarkerSelectedIcon = L.icon({
  iconSize: [40, 40],
  iconUrl: '/assets/images/area-map/icon-pin-red.svg',
  className: 'selected-nearby-marker',
})

export function findAssetMatch(
  assetData: FeatureCollection,
  lat: number,
  lng: number
) {
  return assetData.features.find(
    (assetFeature) =>
      intersection(
        [
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          assetFeature.geometry?.coordinates[0].toFixed(5),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          assetFeature.geometry?.coordinates[1].toFixed(5),
        ],
        [lat.toFixed(5), lng.toFixed(5)]
      ).length === 2
  )
}

export const NearbyLayer: FC<NearbyLayerProps> = ({ zoomLevel }) => {
  const { selection, setItem } = useContext(AssetSelectContext)
  const bbox = useBoundingBox()
  const layerVisible = useLayerVisible(zoomLevel)
  const mapInstance = useMapInstance()
  const { category, subcategory } = useSelector(makeSelectCategory)
  const { get, data, error } = useFetch<FeatureCollection<Point, Properties>>()
  const [activeLayer, setActiveLayer] = useState<NearbyMarker>()
  const featureGroup = useRef<L.FeatureGroup<NearbyMarker>>(L.featureGroup())
  const assetData = useContext<FeatureCollection>(WfsDataContext)

  const onMarkerClick = useCallback(
    (feature: Feature<Point, Properties>) =>
      async ({ sourceTarget }: MarkerMouseEvent) => {
        sourceTarget.setIcon(nearbyMarkerSelectedIcon)
        setActiveLayer(sourceTarget)

        const coordinates = featureToCoordinates(feature.geometry)

        const location: Location = {
          coordinates,
        }

        const item: Item = {
          label: feature.properties.category.name,
          description: formattedDate(feature.properties.created_at),
          type: NEARBY_TYPE,
        }

        setItem(item, location)

        const response = await reverseGeocoderService(coordinates)

        if (response) {
          location.address = response.data.address
        }

        setItem(item, location)
      },
    [setItem]
  )

  useEffect(() => {
    if (!selection || selection.type !== NEARBY_TYPE) {
      setActiveLayer(undefined)
    }
  }, [selection])

  useEffect(() => {
    featureGroup.current.addTo(mapInstance)
  }, [mapInstance])

  useEffect(() => {
    if (!layerVisible) {
      featureGroup.current.clearLayers()
    }
  })

  useEffect(() => {
    if (!layerVisible || !bbox || !category || !subcategory) return

    const { west, south, east, north } = bbox
    const searchParams = new URLSearchParams({
      maincategory_slug: category,
      category_slug: subcategory,
      bbox: `${west},${south},${east},${north}`,
    })

    get(`${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`)
  }, [layerVisible, get, bbox, category, subcategory])

  useEffect(() => {
    featureGroup.current.clearLayers()

    if (error) {
      featureGroup.current.clearAllEventListeners()
      mapInstance.removeLayer(featureGroup.current)
      return
    }

    if (!data?.features) return

    data.features.forEach((feature) => {
      const { lat, lng } = featureToCoordinates(feature.geometry)

      // if an asset exists in the exact same location, then don't draw a marker
      if (findAssetMatch(assetData, lat, lng)) return null

      const uniqueId = `${lat}.${lng}.${feature.properties.created_at}`
      const marker = L.marker(
        { lat, lng },
        {
          alt: uniqueId,
          title: `${feature.properties.category.name}, ${formattedDate(
            feature.properties.created_at
          )}`,
          keyboard: false,
        }
      )

      const isActiveMarker = activeLayer?.options.alt === marker.options.alt

      marker.setIcon(
        isActiveMarker ? nearbyMarkerSelectedIcon : nearbyMarkerIcon
      )
      marker.addEventListener('click', onMarkerClick(feature))

      featureGroup.current.addLayer(marker)
    })
  }, [
    activeLayer,
    data,
    featureGroup,
    mapInstance,
    onMarkerClick,
    error,
    assetData,
  ])
  return (
    <>
      <span data-testid="nearbyLayer" />
    </>
  )
}

export default NearbyLayer
