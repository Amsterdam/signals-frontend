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
    width: ${({width})=> width || `100%`};
    height: ${({height})=> height || `450px`};
  }
`;

const Map = ({ latlng, smallMarker, attributionControl, zoom, ...otherProps }) => {
  const { latitude: lat, longitude: lon } = latlng;
  const options = getMapOptions({
    center: [lat, lon],
    zoom: zoom || 16,
    icon: smallMarker ? smallMarkerIcon : markerIcon,
    attributionControl,
  });

  return (
    <MapWrapperStyle {...otherProps}>
      <MapComponent options={options}>
        <Marker
          args={[{ lat, lon }]}
          options={options}
        />
        <BackgroundLayer />
      </MapComponent>
    </MapWrapperStyle>
  );
};

Map.defaultValues = {
  smallIcon: false,
  attributionControl: true,
};

Map.propTypes = {
  latlng: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  smallMarker: PropTypes.bool,
  attributionControl: PropTypes.bool,
  zoom: PropTypes.number,
};

export default Map;
