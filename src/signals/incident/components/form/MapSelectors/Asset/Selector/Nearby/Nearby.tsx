import { useFetch } from 'hooks'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import L from 'leaflet'
import { useMapInstance } from '@amsterdam/react-maps'

import type { FC } from 'react'
import type { FeatureCollection, Feature } from 'geojson'
import type { LatLngTuple, LeafletMouseEvent } from 'leaflet'
import type { Location } from 'types/incident'

import reverseGeocoderService from 'shared/services/reverse-geocoder'
import { makeSelectCategory } from 'signals/incident/containers/IncidentContainer/selectors'
import configuration from 'shared/services/configuration/configuration'
import { featureToCoordinates } from 'shared/services/map-location'

import { formatDate } from 'signals/incident/containers/IncidentReplyContainer/utils'
import useBoundingBox from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import type { Item } from 'signals/incident/components/form/MapSelectors/types'
import { NEARBY_TYPE } from 'signals/incident/components/form/MapSelectors/constants'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'

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

export const nearbyMarkerIcon = L.icon({
  iconSize: [24, 32],
  iconUrl: '/assets/images/area-map/icon-pin.svg',
})

export const nearbyMarkerSelectedIcon = L.icon({
  iconSize: [40, 40],
  iconUrl: '/assets/images/area-map/icon-pin-red.svg',
})

const formattedDate = (date: string) =>
  formatDate(new Date(date), `'Gemeld op:' dd MMMM`)

const onFeatureGroupClick = ({
  sourceTarget, // clicked marker
  target, // feature group
}: LeafletMouseEvent) => {
  const targetElement = sourceTarget.getElement()

  target.eachLayer((layer: L.Marker<Properties>) => {
    const element = layer.getElement()

    if (!element) return

    if (element !== targetElement) {
      layer.setIcon(nearbyMarkerIcon)
    }
  })
}

/**
 * Component using the Leaflet API to plot markers in a feature layer on a map
 * Because the markers are rendered in a feature group, events can be captured by that group.
 * Which is useful, because the all of the layers in the feature group can be easily targeted.
 */
const Nearby: FC = () => {
  const { selection, setItem } = useContext(AssetSelectContext)
  const bbox = useBoundingBox()
  const mapInstance = useMapInstance()
  const { category, subcategory } = useSelector(makeSelectCategory)
  const { get, data, error } = useFetch<FeatureCollection<Point, Properties>>()
  const [activeLayer, setActiveLayer] = useState<NearbyMarker>()
  const featureGroup = useRef<L.FeatureGroup<NearbyMarker>>(L.featureGroup())

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
    featureGroup.current.on('click', onFeatureGroupClick)
    featureGroup.current.addTo(mapInstance)
  }, [mapInstance])

  useEffect(() => {
    if (!bbox || !category || !subcategory) return

    const { west, south, east, north } = bbox
    const searchParams = new URLSearchParams({
      maincategory_slug: category,
      category_slug: subcategory,
      bbox: `${west},${south},${east},${north}`,
    })

    get(`${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`)
  }, [get, bbox, category, subcategory])

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
      const uniqueId = `${lat}.${lng}.${feature.properties.created_at}`
      const marker = L.marker(
        { lat, lng },
        {
          alt: uniqueId,
          title: `${feature.properties.category.name}, ${formattedDate(
            feature.properties.created_at
          )}`,
        }
      )

      /**
       * When the component updates (on bounding box change, for instance), markers are rerendered.
       * We need to check if a particular marker isn't already present in the feature group to
       * prevent duplicate markers.
       */
      if (featureGroup.current.hasLayer(marker)) return

      const isActiveMarker = activeLayer?.options.alt === marker.options.alt

      marker.setIcon(
        isActiveMarker ? nearbyMarkerSelectedIcon : nearbyMarkerIcon
      )
      marker.addEventListener('click', onMarkerClick(feature))

      featureGroup.current.addLayer(marker)
    })
  }, [activeLayer, data, featureGroup, mapInstance, onMarkerClick, error])

  return <span data-testid="nearby" />
}

export default Nearby
