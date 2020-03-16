import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Map } from '@datapunt/react-maps';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from '@datapunt/asc-core';
import getMapOptions from 'shared/services/configuration/map-options';
import BackgroundLayer from 'shared/components/BackgroundLayer';
import Geocoder, { getSuggestions, getAddressById } from '../Geocoder';

const geocoderProps = {
  getSuggestions,
  getAddressById,
};

const MapWrapperStyle = styled.div`
  position: relative;

  & > div:first-child {
    width: 100%;
    height: 450px;
  }
`;

const MapEditor = ({ location, onLocationChange }) => (
  <MapWrapperStyle>
    <Map options={getMapOptions()}>
      <Geocoder {...geocoderProps} location={location} onLocationChange={onLocationChange} />
      <ViewerContainer style={{ zIndex: 400 }} bottomRight={<Zoom />} />
      <BackgroundLayer />
    </Map>
  </MapWrapperStyle>
);

MapEditor.propTypes = {
  location: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func.isRequired,
};

export default memo(MapEditor);
