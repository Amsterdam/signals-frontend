import React from 'react';
import PropTypes from 'prop-types';
import { Map as MapComponent, Marker } from '@datapunt/react-maps';
import styled from '@datapunt/asc-core';
import BackgroundLayer from 'components/BackgroundLayer';
import { smallMarkerIcon, markerIcon } from 'shared/services/configuration/map-markers';
import MAP_OPTIONS from 'shared/services/configuration/map-options';

const MapWrapper = styled.div`
`;

const StyledMap = styled(MapComponent)`
  width: ${({ width }) => width || `100%`};
  height: ${({ height }) => height || `450px`};
`;

const Map = ({ latlng, smallMarker, attributionControl, zoom, ...otherProps }) => {
  const { latitude: lat, longitude: lng } = latlng;
  const options = {
    ...MAP_OPTIONS,
    center: [lat, lng],
    zoom: zoom || 16,
    icon: smallMarker ? smallMarkerIcon : markerIcon,
    attributionControl,
  };

  return (
    <MapWrapper>
      <StyledMap options={options} {...otherProps}>
        <Marker args={[{ lat, lng }]} options={options} />
        <BackgroundLayer />
      </StyledMap>
    </MapWrapper>
  );
};

Map.defaultProps = {};

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
