import React from 'react';
import PropTypes from 'prop-types';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from '@datapunt/asc-core';
import { Map as MapComponent, Marker, TileLayer } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400; // this elevation ensures that this container comes on top of the internal leaflet components
`;

const Map = ({ lat, lng, mapOptions, icon, hasZoom, ...otherProps }) => (
  <MapComponent data-testid="map-test-id" options={mapOptions} {...otherProps}>
    {hasZoom && <StyledViewerContainer bottomRight={<Zoom />} />}

    {lat && lng && <Marker args={[{ lat, lng }]} options={{ icon }} />}

    <TileLayer
      args={['https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png']}
      options={{
        subdomains: ['t1', 't2', 't3', 't4'],
        tms: true,
        attribution: mapOptions.attributionControl && 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
      }}
    />
  </MapComponent>
);

Map.defaultProps = {
  icon: markerIcon,
  hasZoom: false,
};

Map.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  mapOptions: PropTypes.shape({
    attributionControl: PropTypes.bool,
  }).isRequired /** leaflet options, See `https://leafletjs.com/reference-1.6.0.html#map-option` */,
  icon: PropTypes.shape({}), // leaflet icon object
  hasZoom: PropTypes.bool,
};

export default Map;
