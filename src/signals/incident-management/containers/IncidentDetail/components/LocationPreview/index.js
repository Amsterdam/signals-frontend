import React from 'react';
import PropTypes from 'prop-types';

import { locationType } from 'shared/types';
import { markerIcon } from 'shared/services/configuration/map-markers';
import styled from 'styled-components';
import MapDetail from '../MapDetail';

import './style.scss';

const StyledMap = styled(MapDetail)`
  width: 100%;
  height: 450px;
`;

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

    <StyledMap value={location} zoom={14} icon={markerIcon} hasZoomControls />
  </div>
);

LocationPreview.propTypes = {
  location: locationType.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default LocationPreview;
