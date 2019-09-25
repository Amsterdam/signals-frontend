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
  location: PropTypes.shape({
    geometrie: PropTypes.shape({
      type: PropTypes.string.isRequired,
      coordinates: PropTypes.array.isRequired,
    }),
    buurt_code: PropTypes.string,
    address: PropTypes.oneOfType([PropTypes.shape({
      postcode: PropTypes.string.isRequired,
      huisletter: PropTypes.string.isRequired,
      huisnummer: PropTypes.string.isRequired,
      woonplaats: PropTypes.string.isRequired,
      openbare_ruimte: PropTypes.string.isRequired,
      huisnummer_toevoeging: PropTypes.string.isRequired,
    }), null]),
    stadsdeel: PropTypes.string.isRequired,
    bag_validated: PropTypes.bool.isRequired,
    address_text: PropTypes.string.isRequired,
    id: PropTypes.number,
  }).isRequired,
  onEditLocation: PropTypes.func.isRequired
};

export default LocationPreview;
