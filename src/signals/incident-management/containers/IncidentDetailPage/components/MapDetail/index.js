import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';

import './style.scss';

const MapDetail = ({ value }) => {
  const location = value.geometrie.coordinates;
  const latlng = { lat: location[0], lng: location[1] };
  return (
    <div className="map-detail">
      <Map
        preview
        latlng={latlng}
      />
    </div>
  );
};


MapDetail.propTypes = {
  value: PropTypes.object
};

export default MapDetail;
