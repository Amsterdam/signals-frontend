// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import Leaflet from 'leaflet'

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
  configuration.map.options.center,
  locationDotOptions
)
const accuracyCircle = new Leaflet.Circle(
  configuration.map.options.center,
  accuracyCircleOptions
)

const LocationMarker = ({ geolocation }) => {
  const mapInstance = useMapInstance()

  const { accuracy, latitude, longitude } = geolocation

  const removeLocationDot = () => {
    locationDot.remove()
  }

  const addLocationDot = () => {
    locationDot.setLatLng([latitude, longitude])
    locationDot.addTo(mapInstance)
  }

  useEffect(() => {
    if (!mapInstance) return undefined

    accuracyCircle.addTo(mapInstance)
    accuracyCircle.setLatLng([latitude, longitude])
    accuracyCircle.setRadius(accuracy)

    mapInstance.on('zoom', removeLocationDot)
    mapInstance.on('zoomend', addLocationDot)

    return () => {
      locationDot.remove()
      accuracyCircle.remove()
    }
  }, [mapInstance, latitude, longitude, accuracy])

  return <span data-testid="locationMarker" />
}

LocationMarker.propTypes = {
  geolocation: PropTypes.shape({
    accuracy: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
}

export default LocationMarker
