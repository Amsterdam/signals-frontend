import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, themeSpacing, Row, Column } from '@datapunt/asc-ui';
import { locationType } from 'shared/types';
import { markerIcon } from 'shared/services/configuration/map-markers';
import MapDetail from '../MapDetail';

const Wrapper = styled(Row)`
  padding-top: 20px;
  position: relative;
`;

const StyledColumn = styled(Column)`
  display: block;
  background: white;
  position: relative;
`;

const EditButton = styled(Button)`
  position: absolute;
  top: ${themeSpacing(3)};
  left: ${themeSpacing(3)};
  z-index: 401;
`;

const StyledMap = styled(MapDetail)`
  width: 100%;
  height: 450px;
`;

const LocationPreview = ({ location, onEditLocation }) => (
  <Wrapper>
    <StyledColumn span={12}>
      <EditButton variant="secondary" onClick={onEditLocation} data-testid="location-preview-button-edit">
        Locatie wijzigen
      </EditButton>

      <StyledMap value={location} icon={markerIcon} hasZoomControls zoom={14} />
    </StyledColumn>
  </Wrapper>
);

LocationPreview.propTypes = {
  location: locationType.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default LocationPreview;
