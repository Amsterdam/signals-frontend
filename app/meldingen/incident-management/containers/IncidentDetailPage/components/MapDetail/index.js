import React from 'react';
import PropTypes from 'prop-types';
import MapContainer from 'containers/MapContainer';

import './style.scss';

const MapDetail = ({ value }) => {
  const location = value.geometrie.coordinates;
  const latlng = { lat: location[0], lng: location[1] };
  return (
    <div className="map-detail">
      <MapContainer
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
