/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */

import type { FC } from 'react'
import './style.css'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import { useMapInstance } from '@amsterdam/react-maps'
import type { FeatureCollection, Feature } from 'geojson'
import L from 'leaflet'
import type { LeafletMouseEvent } from 'leaflet'
import intersection from 'lodash/intersection'
import { useSelector } from 'react-redux'

import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import { featureToCoordinates } from 'shared/services/map-location'
import type { LatLng } from 'shared/services/map-location/map-location'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import { NEARBY_TYPE } from 'signals/incident/components/form/MapSelectors/constants'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import useLayerVisible from 'signals/incident/components/form/MapSelectors/hooks/useLayerVisible'
import type { Item } from 'signals/incident/components/form/MapSelectors/types'
import {
  makeSelectCategory,
  makeSelectIncidentContainer,
} from 'signals/incident/containers/IncidentContainer/selectors'
import type { Location } from 'types/incident'

import { formattedDate } from '../utils'
import WfsDataContext from '../WfsLayer/context'

// Custom Point type, because the compiler complains about the coordinates type
type Point = {
  type: 'Point'
  coordinates: LatLng
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      intersection(assetFeature.geometry?.coordinates, [lat, lng]).length === 2
  )
}

export const NearbyLayer: FC<NearbyLayerProps> = ({ zoomLevel }) => {
  const { selection, setItem } = useContext(AssetSelectContext)
  const bbox = useBoundingBox()
  const layerVisible = useLayerVisible(zoomLevel)
  const mapInstance = useMapInstance()
  const { category, subcategory } = useSelector(makeSelectCategory)
  const { incident } = useSelector(makeSelectIncidentContainer)
  const { get, data, error } = useFetch<FeatureCollection<Point, Properties>>()
  const [activeLayer, setActiveLayer] = useState<NearbyMarker>()
  const featureGroup = useRef<L.FeatureGroup<NearbyMarker>>(L.featureGroup())
  const assetData = useContext<FeatureCollection>(WfsDataContext)

  /* istanbul ignore next */
  const onMarkerClick = useCallback(
    (feature: Feature<Point, Properties>) =>
      async ({ sourceTarget }: MarkerMouseEvent) => {
        sourceTarget.setIcon(nearbyMarkerSelectedIcon)
        setActiveLayer(sourceTarget)

        const coordinates = featureToCoordinates(feature.geometry)

        const location: Location = { coordinates }
        const item: Item = {
          id: `${coordinates.lat}.${coordinates.lng}.${feature.properties.created_at}`,
          label: feature.properties.category.name,
          description: formattedDate(feature.properties.created_at),
          type: NEARBY_TYPE,
          coordinates,
        }

        setItem(item, location)

        const response = await reverseGeocoderService(coordinates)
        if (response) {
          location.address = response.data.address
          item.address = response.data.address
        }

        setItem(item, location)
      },
    [setItem]
  )

  useEffect(() => {
    if (!selection || selection[0].type !== NEARBY_TYPE) {
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
    if (
      !layerVisible ||
      !bbox ||
      !category ||
      !subcategory ||
      !incident?.category_is_public_accessible
    )
      return

    const { west, south, east, north } = bbox
    const searchParams = new URLSearchParams({
      maincategory_slug: category,
      category_slug: subcategory,
      bbox: `${west},${south},${east},${north}`,
    })

    get(`${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`)
  }, [
    layerVisible,
    get,
    bbox,
    category,
    subcategory,
    incident?.category_is_public_accessible,
  ])

  useEffect(() => {
    featureGroup.current.clearLayers()

    if (error) {
      featureGroup.current.clearAllEventListeners()
      mapInstance.removeLayer(featureGroup.current)
      return
    }

    if (!data?.features) return

    const hasNearbySelection = selection && selection[0].type === NEARBY_TYPE

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
          zIndexOffset: -1,
        }
      )

      const isActiveMarker = activeLayer
        ? activeLayer?.options.alt === marker.options.alt
        : Boolean(hasNearbySelection && selection[0].id === marker.options.alt)

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
    selection,
  ])
  return (
    <>
      <span data-testid="nearby-layer" />
    </>
  )
}

export default NearbyLayer
