import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@datapunt/asc-core';
import MapImplementation from './MapImplementation';
import MapContainer from '../MapContainer';

const MapWrapper = styled.div`
  position: relative;
`;

const MapEditor = ({ value, onLocationChange, mapOptions, ...otherProps }) => (
  <MapContainer >
    <MapWrapper>
      <MapImplementation data-testid="map-editor" value={value} onChange={onLocationChange} mapOptions={mapOptions} {...otherProps} />
    </MapWrapper>
  </MapContainer>
);

MapEditor.propTypes = {
  value: PropTypes.shape({
    geometrie: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
    address: PropTypes.shape({
      openbare_ruimte: PropTypes.string,
      huisnummer: PropTypes.string,
      huisletter: PropTypes.string,
      huisnummer_toevoeging: PropTypes.string,
      postcode: PropTypes.string,
      woonplaats: PropTypes.string,
    }),
  }).isRequired,
  mapOptions: PropTypes.shape({})
    .isRequired /** leaflet options, See `https://leafletjs.com/reference-1.6.0.html#map-option` */,
  onLocationChange: PropTypes.func.isRequired,
};

export default memo(MapEditor);
