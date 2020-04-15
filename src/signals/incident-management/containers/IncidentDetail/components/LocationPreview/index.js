import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, themeSpacing } from '@datapunt/asc-ui';
import { locationType } from 'shared/types';
import { markerIcon } from 'shared/services/configuration/map-markers';
import MapDetail from '../MapDetail';

const Wrapper = styled.div`
  position: relative;
`;

const EditButton = styled(Button)`
  position: absolute
  top: ${themeSpacing(3)};
  left: ${themeSpacing(3)};
  z-index: 500;
`;

const StyledMap = styled(MapDetail)`
  width: 100%;
  height: 450px;
`;

const LocationPreview = ({ location, onEditLocation }) => (
  <Wrapper>
    <EditButton variant="secondary" onClick={onEditLocation} data-testid="location-preview-button-edit">
      Locatie wijzigen
    </EditButton>

    <StyledMap value={location} zoom={14} icon={markerIcon} hasZoomControls />
  </Wrapper>
);

LocationPreview.propTypes = {
  location: locationType.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default LocationPreview;
