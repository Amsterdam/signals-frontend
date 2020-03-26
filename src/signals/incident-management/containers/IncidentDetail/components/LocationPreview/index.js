import React from 'react';
import PropTypes from 'prop-types';

import { locationType } from 'shared/types';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import MapDetail from '../MapDetail';

import './style.scss';

const mapOptions = {
  ...MAP_OPTIONS,
  zoom: 16,
  attributionControl: false, // don't show the map credits in the right bottom corner
};

const LocationPreview = ({ location, onEditLocation }) => (
  <div className="location-preview">
    <button
      className="action primary location-preview__button-edit"
      type="button"
      onClick={onEditLocation}
      data-testid="location-preview-button-edit"
    >
      Locatie wijzigen
    </button>

    <MapDetail value={location} mapOptions={mapOptions} isInteractive={false} />
  </div>
);

LocationPreview.propTypes = {
  location: locationType.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default LocationPreview;
