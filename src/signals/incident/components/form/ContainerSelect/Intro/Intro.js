import React, { useCallback, useState, useContext } from 'react';
import styled from 'styled-components';
import Button from 'components/Button';
import { themeColor, themeSpacing } from '@amsterdam/asc-ui';
import ContainerSelectContext from '../context';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import Map from 'components/Map';

const Wrapper = styled.div`
  position: relative;
  border: 1px dotted ${themeColor('tint', 'level3')};
  height: ${themeSpacing(40)};
`;

const ButtonBar = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 401; // 400 is the minimum elevation where elements are shown above the map
`;

const StyledMap = styled(Map)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Intro = () => {
  const { edit, location } = useContext(ContainerSelectContext);
  const lat = location && location[1];
  const lng = location && location[0];
  const options = {
    ...MAP_OPTIONS,
    attributionControl: false,
    center: [lat, lng],
  };

  return (
    <Wrapper data-testid="containerSelectIntro">
      {lat && lng && (
        <StyledMap
          data-testid="mapLocation"
          mapOptions={options}
          canBeDragged={false}
          hasZoomControls={false}
        ></StyledMap>
      )}

      <ButtonBar>
        <Button onClick={edit}>Kies op kaart</Button>
      </ButtonBar>
    </Wrapper>
  );
};

export default Intro;
