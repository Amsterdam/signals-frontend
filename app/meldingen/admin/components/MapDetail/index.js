import React from 'react';
import PropTypes from 'prop-types';
import MapContainer from 'containers/MapContainer';

import './style.scss';

const MapDetail = ({ value }) => (
  <div className="map-detail">
    <MapContainer
      preview
      latlng={{ lat: value.latitude, lng: value.logitude }}
    />
  </div>
);

MapDetail.propTypes = {
  value: PropTypes.object
};

export default MapDetail;
