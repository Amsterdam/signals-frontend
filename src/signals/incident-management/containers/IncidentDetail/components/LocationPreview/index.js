import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@datapunt/asc-ui';

import { locationType } from 'shared/types';

import MapDetail from '../MapDetail';

const Wrapper = styled.div`
  position: relative;
  z-index: 0;
`;

const EditButton = styled(Button)`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
`;

const LocationPreview = ({ location, onEditLocation }) => (
  <Wrapper>
    <EditButton color="secondary" onClick={onEditLocation} data-testid="location-preview-button-edit">
      Locatie wijzigen
    </EditButton>

    <MapDetail value={location} zoom="16" />
  </Wrapper>
);

LocationPreview.propTypes = {
  location: locationType.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default LocationPreview;
