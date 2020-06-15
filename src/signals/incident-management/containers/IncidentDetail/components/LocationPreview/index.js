import React from 'react';
import PropTypes from 'prop-types';

import { locationType } from 'shared/types';
import { markerIcon } from 'shared/services/configuration/map-markers';
import styled from 'styled-components';
import Button from 'components/Button';
import { themeSpacing } from '@datapunt/asc-ui';
import MapDetail from '../MapDetail';

const StyledMap = styled(MapDetail)`
  width: 100%;
  height: 450px;
`;

const Wrapper = styled.div`
  position: relative;
`;

const StyledButton = styled(Button)`
  position: absolute;
  margin: 0;
  top: ${themeSpacing(3)};
  left: ${themeSpacing(3)};
  z-index: 500;
`;

const LocationPreview = ({ location, onEditLocation }) => (
  <Wrapper>
    <StyledButton type="button" variant="secondary" onClick={onEditLocation} data-testid="location-preview-button-edit">
      Locatie wijzigen
    </StyledButton>

    <StyledMap value={location} zoom={14} icon={markerIcon} hasZoomControls />
  </Wrapper>
);

LocationPreview.propTypes = {
  location: locationType.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default LocationPreview;
