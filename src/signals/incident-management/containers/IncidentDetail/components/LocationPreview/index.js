// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button, themeSpacing, Row, Column } from '@amsterdam/asc-ui';

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

const LocationPreview = () => {
  const { incident: { location }, edit } = useContext(IncidentDetailContext);
  return (
    <Wrapper>
      <StyledColumn span={12}>
        <EditButton variant="secondary" onClick={() => edit('location')} data-testid="location-preview-button-edit">
          Locatie wijzigen
        </EditButton>

        <StyledMap value={location} icon={markerIcon} hasZoomControls zoom={14} />
      </StyledColumn>
    </Wrapper>
  );
};

export default LocationPreview;
