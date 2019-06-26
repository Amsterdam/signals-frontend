import React from 'react';
import PropTypes from 'prop-types';

import MapDetail from '../MapDetail';


import './style.scss';

const LocationPreview = ({ incident, onEditLocation }) => (
  <div className="location-preview">
    <button className="action primary location-preview__button-edit" onClick={onEditLocation}>Locatie wijzigen</button>

    <MapDetail
      value={incident.location}
      zoom="16"
    />
  </div>
);

LocationPreview.propTypes = {
  incident: PropTypes.object.isRequired,
  onEditLocation: PropTypes.func.isRequired
};

export default LocationPreview;
