import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Map from 'components/Map';
import { markerIcon } from 'shared/services/configuration/map-markers';
import { Marker } from '@datapunt/react-maps';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import { locationType } from 'shared/types';
import './style.scss';

const StyledMap = styled(Map)`
  height: 80px;
  width: 80px;
`;

const MapDetail = ({ value, className, zoom, icon }) => {
  const location = value?.geometrie?.coordinates;
  const lat = location && location[1];
  const lng = location && location[0];
  const options = {
    ...MAP_OPTIONS,
    zoom,
    attributionControl: false,
    center: [lat, lng],
  };

  return (lat && lng) ? (
    <StyledMap data-testid="map-detail" mapOptions={options} isInteractive={false} className={className}>
      <Marker data-testid="map-marker" args={[{ lat, lng }]} options={{ icon }} />
    </StyledMap>
  ) : null;
};

MapDetail.defaultProps = {
  className: '',
  icon: markerIcon,
};

MapDetail.propTypes = {
  value: locationType.isRequired,
  className: PropTypes.string,
  zoom: PropTypes.number.isRequired,
  icon: PropTypes.shape({}), // leaflet icon object
};

export default MapDetail;
