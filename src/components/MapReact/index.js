import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from '@datapunt/react-maps';
import { getCrsRd } from '@datapunt/amsterdam-react-maps/lib/utils';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from '@datapunt/asc-core';
import Geocoder, { getSuggestions, getAddressById } from '../Geocoder';

const geocoderProps = {
  getSuggestions,
  getAddressById,
};

const mapProps = {
  options: {
    center: [52.3731081, 4.8932945],
    zoomControl: false,
    zoom: 10,
    crs: getCrsRd(),
    maxBounds: [
      [52.25168, 4.64034],
      [52.50536, 5.10737],
    ],
  },
  style: {
    width: '100%',
    height: '450px',
  },
};

const MapWrapperStyle = styled.div`position: relative;`;

const MapReact = ({ onLocationChange }) => (
  <MapWrapperStyle>
    <Map {...mapProps}>
      <Geocoder {...geocoderProps} onLocationChange={onLocationChange} />
      <ViewerContainer
        style={{ zIndex: 400 }}
        bottomRight={<Zoom />}
      />
      <TileLayer
        args={['https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png']}
        options={{
          subdomains: ['t1', 't2', 't3', 't4'],
          tms: true,
          attribution: 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
        }}
      />
    </Map>
  </MapWrapperStyle>
);
MapReact.propTypes = {
  location: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func.isRequired,
};

export default MapReact;
