import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';

import './style.scss';

const MapDetail = ({ value }) => {
  const location = value && value.geometrie && value.geometrie.coordinates;
  // console.log('MapDetail location: ', location);

  const latlng = location ? { latitude: location[0], longitude: location[1] } : null;
  return (
    <div className="map-detail">
      {latlng ?
        <Map
          preview
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
