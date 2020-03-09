import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';

import { locationType } from 'shared/types';

import './style.scss';

const MapDetail = ({
  value, smallMarker, zoom, hideAttribution,
}) => {
  const location = value && value.geometrie && value.geometrie.coordinates;
  const latlng = location ? { latitude: location[1], longitude: location[0] } : null;
  return (
    <div className="map-detail">
      {latlng
        ? (
          <Map
            latlng={latlng}
            smallMarker={smallMarker}
            hideAttribution={hideAttribution}
            zoom={zoom}
            width="80px"
            height="80px"
          />
        ) : ''}
    </div>
  );
};

MapDetail.propTypes = {
  value: locationType.isRequired,
  hideAttribution: PropTypes.bool,
  smallMarker: PropTypes.bool,
  zoom: PropTypes.string,
};

export default MapDetail;
