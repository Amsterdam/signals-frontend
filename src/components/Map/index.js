import React from 'react';
import PropTypes from 'prop-types';
import { Map as MapComponent, Marker } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';
import BackgroundLayer from 'components/BackgroundLayer';

const Map = ({ latlng, mapOptions, icon, ...otherProps }) => {
  const { latitude: lat, longitude: lng } = latlng;

  return (
    <MapComponent options={mapOptions} {...otherProps}>
      <Marker args={[{ lat, lng }]} options={{ icon }} />
      <BackgroundLayer />
    </MapComponent>
  );
};

Map.defaultProps = {
  icon: markerIcon,
};

Map.propTypes = {
  latlng: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  mapOptions: PropTypes.shape({}).isRequired /** leaflet options */,
  icon: PropTypes.shape({}),
};

export default Map;
