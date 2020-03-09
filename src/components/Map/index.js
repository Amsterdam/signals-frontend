import React from 'react';
import PropTypes from 'prop-types';
import { Map as ArmMap, Marker } from '@datapunt/react-maps';
import styled from '@datapunt/asc-core';
import getMapOptions from 'shared/services/configuration/map-options';
import BackgroundLayer from 'shared/components/BackgroundLayer';
import { AmsterdamMarkerIcon } from '../Geocoder/MarkerIcons';

const MapWrapperStyle = styled.div`
  position: relative;

  & > div:first-child {
    width: 100%;
    height: 450px;
  }
`;

const Map = ({ latlng }) => {
  const { latitude: lat, longitude: lon } = latlng;
  const options = getMapOptions({
    center: [lat, lon],
    zoom: 16,
  });

  return (
    <MapWrapperStyle>
      <ArmMap options={options}>
        <Marker
          args={[{ lat, lon }]}
          options={{
            icon: AmsterdamMarkerIcon,
          }}
        />
        <BackgroundLayer />
      </ArmMap>
    </MapWrapperStyle>
  );
};

Map.propTypes = {
  latlng: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
};

export default Map;
