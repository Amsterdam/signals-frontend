import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';

import './style.scss';

const MapDetail = ({ value }) => {
  const location = value && value.geometrie && value.geometrie.coordinates;
  const latlng = location ? { latitude: location[1], longitude: location[0] } : null;
  return (
    <div className="map-detail">
      {latlng ?
        <Map
          latlng={latlng}
        /> : ''
      }
    </div>
  );
};


MapDetail.propTypes = {
  value: PropTypes.object
};

export default MapDetail;
