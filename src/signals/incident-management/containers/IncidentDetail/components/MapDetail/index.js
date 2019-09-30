import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';

import { locationType } from 'shared/types';

import './style.scss';

const MapDetail = ({ value, hideAttribution, hideZoomControls, useSmallMarker, zoom }) => {
  const location = value && value.geometrie && value.geometrie.coordinates;
  const latlng = location ? { latitude: location[1], longitude: location[0] } : null;
  return (
    <div className="map-detail">
      {latlng ?
        <Map
          latlng={latlng}
          hideAttribution={hideAttribution}
          hideZoomControls={hideZoomControls}
          useSmallMarker={useSmallMarker}
          zoom={zoom}
        /> : ''
      }
    </div>
  );
};

MapDetail.propTypes = {
  value: locationType.isRequired,
  hideAttribution: PropTypes.bool,
  hideZoomControls: PropTypes.bool,
  useSmallMarker: PropTypes.bool,
  zoom: PropTypes.string
};

export default MapDetail;
