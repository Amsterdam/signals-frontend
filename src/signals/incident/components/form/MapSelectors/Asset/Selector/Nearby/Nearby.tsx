import { useFetch } from 'hooks'
import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import L from 'leaflet'
import { useMapInstance } from '@amsterdam/react-maps'

import type { FC } from 'react'
import type { FeatureCollection, Feature } from 'geojson'
import type { LatLngTuple, LeafletMouseEvent } from 'leaflet'

import { makeSelectCategory } from 'signals/incident/containers/IncidentContainer/selectors'
import configuration from 'shared/services/configuration/configuration'
import { featureToCoordinates } from 'shared/services/map-location'

import useBoundingBox from '../../../../hooks/useBoundingBox'

interface NearbyProps {
  className?: string
  onMarkerSelect: (properties: Properties) => void
}

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

const nearbyMarkerIcon = L.icon({
  iconSize: [24, 32],
  iconUrl: '/assets/images/area-map/icon-pin.svg',
})

const nearbyMarkerSelectedIcon = L.icon({
  iconSize: [40, 40],
  iconUrl: '/assets/images/area-map/icon-pin-red.svg',
})

const Nearby: FC<NearbyProps> = ({ onMarkerSelect }) => {
  const bbox = useBoundingBox()
  const mapInstance = useMapInstance()
  const { category, subcategory } = useSelector(makeSelectCategory)
  const { get, data } = useFetch<FeatureCollection<Point, Properties>>()
  // const [activeLayer, setActiveLayer] = useState()

  const onFeatureClick = ({
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

  const featureGroup = useRef<L.FeatureGroup<NearbyMarker>>(
    L.featureGroup().on('click', onFeatureClick).addTo(mapInstance)
  )

  const onMarkerClick = useCallback(
    (feature: Feature<Point, Properties>) =>
      ({ originalEvent, sourceTarget }: MarkerMouseEvent) => {
        // prevent a location marker from being placed on the map
        originalEvent.stopPropagation()

        sourceTarget.setIcon(nearbyMarkerSelectedIcon)

        onMarkerSelect(feature.properties)
      },
    [onMarkerSelect]
  )

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
    if (!data?.features) return

    // if (featureGroup.getLayers().length > 0) {
    // console.log('clearing layers')
    // featureGroup.clearLayers()
    featureGroup.current.clearLayers()
    // mapInstance.removeLayer(featureGroup.current)
    // featureGroup.current.addTo(mapInstance)
    // }

    // featureGroup.clearAllEventListeners()

    data.features.forEach((feature) => {
      const { lat, lng } = featureToCoordinates(feature.geometry)
      const icon = nearbyMarkerIcon
      const marker = L.marker({ lat, lng }, { icon })

      if (featureGroup.current.hasLayer(marker)) return

      marker.addEventListener('click', onMarkerClick(feature))

      featureGroup.current.addLayer(marker)
    })
    //     const { lat, lng } = featureToCoordinates(feature.geometry)
    //     const uniqueId = `${lat}.${lng}.${feature.properties.created_at}`
    //     const pin = activeMarkerId === uniqueId ? 'pin-red' : 'pin'

    //     console.log('rendering ', uniqueId, '; pin: ', pin)
    //     return (
    //       <Marker
    //         key={uniqueId}
    //         latLng={{ lat, lng }}
    //         options={{
    //           icon: L.icon({
    //             iconSize: [24, 32],
    //             iconUrl: `/assets/images/area-map/icon-${pin}.svg`,
    //           }),
    //         }}
    //         events={{
    //           // Disabling linter; arm-core Marker component uses an incorrect type
    //           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //           // @ts-ignore
    //           click: onMarkerClick(feature, uniqueId),
    //         }}
    //       />
    //     )
    //   })

    //   setMarkers(markersFromData)
  }, [data, featureGroup, mapInstance, onMarkerClick])

  return <span data-testid="nearby" />
}

export default Nearby
