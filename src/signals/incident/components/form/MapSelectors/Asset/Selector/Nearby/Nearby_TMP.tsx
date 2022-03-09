import { useFetch } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import { Marker } from '@amsterdam/arm-core'
import L from 'leaflet'

import type { FC } from 'react'
import type { FeatureCollection, Feature } from 'geojson'
import type { LatLngTuple, LeafletMouseEvent } from 'leaflet'

import configuration from 'shared/services/configuration/configuration'
import { featureToCoordinates } from 'shared/services/map-location'
import { useSelector } from 'react-redux'
import { makeSelectCategory } from 'signals/incident/containers/IncidentContainer/selectors'
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

interface MarkerMouseEvent extends LeafletMouseEvent {
  sourceTarget: L.Marker<Properties>
}

const Nearby: FC<NearbyProps> = ({ onMarkerSelect }) => {
  const bbox = useBoundingBox()
  const [activeMarkerId, setActiveMarkerId] = useState<string>()
  // const [markers, setMarkers] = useState<JSX.Element[]>([])
  const { get, data } = useFetch<FeatureCollection<Point, Properties>>()
  const { category, subcategory } = useSelector(makeSelectCategory)

  const onMarkerClick = useCallback(
    (feature: Feature<Point, Properties>, uniqueId: string) =>
      ({ originalEvent, sourceTarget }: MarkerMouseEvent) => {
        // prevent a location marker from being placed on the map
        originalEvent.stopPropagation()

        sourceTarget.setIcon(
          L.icon({
            iconSize: [40, 40],
            iconUrl: '/assets/images/area-map/icon-pin-red.svg',
          })
        )

        setActiveMarkerId(uniqueId)
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

  // useEffect(() => {
  //   if (!data?.features) return

  //   const markersFromData = data.features.map((feature) => {
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
  // }, [activeMarkerId, data, onMarkerClick])

  const markerFromFeature = useCallback(
    (feature: Feature<Point, Properties>) => {
      const { lat, lng } = featureToCoordinates(feature.geometry)
      const uniqueId = `${lat}.${lng}.${feature.properties.created_at}`
      const isActiveMarker = activeMarkerId === uniqueId

      const icon = L.icon({
        iconSize: isActiveMarker ? [40, 40] : [24, 32],
        iconUrl: `/assets/images/area-map/icon-pin${
          isActiveMarker ? '-red' : ''
        }.svg`,
      })

      return (
        <Marker
          key={uniqueId}
          latLng={{ lat, lng }}
          options={{
            icon,
          }}
          events={{
            // Disabling linter; arm-core Marker component uses an incorrect type
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            click: onMarkerClick(feature, uniqueId),
          }}
        />
      )
    },
    [activeMarkerId, onMarkerClick]
  )

  return <>{data?.features?.map(markerFromFeature) ?? null}</>
}

export default Nearby
