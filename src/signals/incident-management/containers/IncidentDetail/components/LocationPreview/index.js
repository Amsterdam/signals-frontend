import React from 'react';
import PropTypes from 'prop-types';

import MapDetail from '../MapDetail';


import './style.scss';

const LocationPreview = ({ location, onEditLocation }) => (
  <div className="location-preview">
    <button className="action primary location-preview__button-edit" onClick={onEditLocation} data-testid="location-preview-button-edit">Locatie wijzigen</button>

    <MapDetail
      value={location}
      zoom="16"
    />
  </div>
);

LocationPreview.propTypes = {
  location: PropTypes.object.isRequired,
  onEditLocation: PropTypes.func.isRequired
};

export default LocationPreview;
