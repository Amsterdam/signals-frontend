import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';
import { markerIcon } from 'shared/services/configuration/map-markers';
import { Marker } from '@amsterdam/react-maps';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import { locationType } from 'shared/types';
import './style.scss';

const MapDetail = ({ value, className, zoom, icon, hasZoomControls }) => {
  const location = value?.geometrie?.coordinates;
  const lat = location && location[1];
  const lng = location && location[0];
  const options = {
    ...MAP_OPTIONS,
    zoom,
    attributionControl: false,
    center: [lat, lng],
  };

  return lat && lng ? (
    <Map data-testid="mapDetail" mapOptions={options} className={className} hasZoomControls={hasZoomControls}>
      <Marker args={[{ lat, lng }]} options={{ icon }} />
    </Map>
  ) : null;
};

MapDetail.defaultProps = {
  className: '',
  hasZoomControls: false,
  icon: markerIcon,
};

MapDetail.propTypes = {
  className: PropTypes.string,
  hasZoomControls: PropTypes.bool,
  icon: PropTypes.shape({}), // leaflet icon object
  value: locationType.isRequired,
  zoom: PropTypes.number.isRequired,
};

export default MapDetail;
