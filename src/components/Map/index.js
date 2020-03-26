import React from 'react';
import PropTypes from 'prop-types';
import { Marker } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';
import MapBase from '../MapBase';

const Map = ({ className, lat, lng, icon, ...otherProps }) => (
  <MapBase className={className} data-testid="map-base" {...otherProps}>
    {lat && lng && <Marker args={[{ lat, lng }]} options={{ icon }} />}
  </MapBase>
);

Map.defaultProps = {
  className: '',
  icon: markerIcon,
};

Map.propTypes = {
  className: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
  icon: PropTypes.shape({}), // leaflet icon object
};

export default Map;
