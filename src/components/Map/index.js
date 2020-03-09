import React from 'react';
import PropTypes from 'prop-types';
import { Map as MapComponent, Marker } from '@datapunt/react-maps';
import styled from '@datapunt/asc-core';
import getMapOptions from 'shared/services/configuration/map-options';
import BackgroundLayer from 'shared/components/BackgroundLayer';
import { smallMarkerIcon, markerIcon } from 'shared/services/configuration/map-markers';

const MapWrapperStyle = styled.div`
  position: relative;

  & > div:first-child {
    width: 100%;
    height: 450px;
  }
`;

const Map = ({ latlng, smallIcon }) => {
  const { latitude: lat, longitude: lon } = latlng;
  const options = getMapOptions({
    center: [lat, lon],
    zoom: 16,
  });

  return (
    <MapWrapperStyle>
      <MapComponent options={options}>
        <Marker
          args={[{ lat, lon }]}
          options={{
            icon: smallIcon? smallMarkerIcon : markerIcon,
          }}
        />
        <BackgroundLayer />
      </MapComponent>
    </MapWrapperStyle>
  );
};

Map.defaultValues = {
  smallIcon: false,
};

Map.propTypes = {
  latlng: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  smallIcon: PropTypes.bool,
};

export default Map;
