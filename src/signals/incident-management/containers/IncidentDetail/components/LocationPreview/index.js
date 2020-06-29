import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, themeSpacing, Row, Column } from '@datapunt/asc-ui';

import { markerIcon } from 'shared/services/configuration/map-markers';

import MapDetail from '../MapDetail';
import IncidentDetailContext from '../../context';

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

const LocationPreview = ({ onEditLocation }) => {
  const { incident: { location } } = useContext(IncidentDetailContext);
  return (
    <Wrapper>
      <StyledColumn span={12}>
        <EditButton variant="secondary" onClick={onEditLocation} data-testid="location-preview-button-edit">
          Locatie wijzigen
        </EditButton>

        <StyledMap value={location} icon={markerIcon} hasZoomControls zoom={14} />
      </StyledColumn>
    </Wrapper>
  );
};

LocationPreview.propTypes = {
  onEditLocation: PropTypes.func.isRequired,
};

export default LocationPreview;
