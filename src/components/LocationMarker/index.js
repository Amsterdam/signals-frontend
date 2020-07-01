import { useEffect } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

import { useMapInstance } from '@datapunt/react-maps';
import configuration from 'shared/services/configuration/configuration';

const circleMarkerOptions = {
  fillColor: '#009de6',
  fillOpacity: 1.0,
  interactive: false,
  opacity: 1.0,
  color: 'white',
  weight: 2,
  radius: 10,
};
const circleOptions = {
  fillColor: '#009de6',
  fillOpacity: 0.2,
  interactive: false,
  stroke: false,
};
const locationDot = new L.CircleMarker(configuration.map.options.center, circleMarkerOptions);
const accuracyCircle = new L.Circle(configuration.map.options.center, circleOptions);

const LocationMarker = ({ geolocation }) => {
  const mapInstance = useMapInstance();

  const { accuracy, latitude, longitude } = geolocation;

  useEffect(() => {
    if (!mapInstance) return;

    locationDot.addTo(mapInstance);
    locationDot.setLatLng([latitude, longitude]);

    accuracyCircle.addTo(mapInstance);
    accuracyCircle.setLatLng([latitude, longitude]);
    accuracyCircle.setRadius(accuracy);
  }, [mapInstance, latitude, longitude, accuracy]);

  return null;
};

LocationMarker.propTypes = {
  geolocation: PropTypes.shape({
    accuracy: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
};

export default LocationMarker;
