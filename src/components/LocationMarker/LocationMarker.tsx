// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FC } from 'react'
import { useEffect } from 'react'
import type { LatLngTuple, Map } from 'leaflet'
import Leaflet from 'leaflet'

import type { LocationResult } from 'components/GPSButton/GPSButton'

import { useMapInstance } from '@amsterdam/react-maps'
import configuration from 'shared/services/configuration/configuration'

const locationDotOptions = {
  fillColor: '#009de6',
  fillOpacity: 1.0,
  interactive: false,
  opacity: 1.0,
  color: 'white',
  weight: 2,
  radius: 10,
}

const accuracyCircleOptions = {
  fillColor: '#009de6',
  fillOpacity: 0.1,
  interactive: false,
  stroke: false,
}

const locationDot = new Leaflet.CircleMarker(
  configuration.map.options.center as LatLngTuple,
  locationDotOptions
)
const accuracyCircle = new Leaflet.Circle(
  configuration.map.options.center as LatLngTuple,
  accuracyCircleOptions
)

const addLocationDot = (mapInstance: Map, coordinates: LatLngTuple) => {
  locationDot.setLatLng(coordinates)
  locationDot.addTo(mapInstance)
}

const removeLocationDot = () => {
  locationDot.remove()
}

interface LocationMarkerProps {
  geolocation: LocationResult
}

const LocationMarker: FC<LocationMarkerProps> = ({ geolocation }) => {
  const mapInstance = useMapInstance()

  const { accuracy, latitude, longitude } = geolocation

  useEffect(() => {
    if (!mapInstance) return undefined
    const coordinates = [latitude, longitude] as LatLngTuple

    accuracyCircle.addTo(mapInstance)
    accuracyCircle.setLatLng(coordinates)

    if (accuracy) {
      accuracyCircle.setRadius(accuracy)
    }

    mapInstance.on('zoom', removeLocationDot)
    mapInstance.on('zoomend', () => addLocationDot(mapInstance, coordinates))

    return () => {
      locationDot.remove()
      accuracyCircle.remove()
      mapInstance.off('zoom', removeLocationDot)
      mapInstance.off('zoomend', () => addLocationDot(mapInstance, coordinates))
    }
  }, [mapInstance, latitude, longitude, accuracy])

  return <span data-testid="locationMarker" />
}

export default LocationMarker
