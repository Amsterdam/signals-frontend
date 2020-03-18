import React from 'react';
import PropTypes from 'prop-types';
import { Map as MapComponent, Marker, TileLayer } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';

const Map = ({ lat, lng, options, icon, children, ...otherProps }) => (
  <MapComponent data-testid="map-test-id" options={options} {...otherProps}>
    {children}

    {lat && lng && <Marker args={[{ lat, lng }]} options={{ icon }} />}

    <TileLayer
      args={['https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png']}
      options={{
        subdomains: ['t1', 't2', 't3', 't4'],
        tms: true,
        attribution: options.attributionControl && 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
      }}
    />
  </MapComponent>
);

Map.defaultProps = {
  icon: markerIcon,
};

Map.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  options: PropTypes.shape({
    attributionControl: PropTypes.bool,
  }).isRequired /** leaflet options */,
  icon: PropTypes.shape({}), // leaflet icon object
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Map;
