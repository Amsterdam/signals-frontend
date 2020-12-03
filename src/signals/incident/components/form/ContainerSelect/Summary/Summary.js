import React, { useCallback, useState, useContext } from 'react';
import styled from 'styled-components';
import Button from 'components/Button';
import { themeColor, themeSpacing } from '@amsterdam/asc-ui';
import ContainerSelectContext from '../context';

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
`;


const Summary = () => {
  const { edit } = useContext(ContainerSelectContext);

  return (
    <Wrapper data-testid="containerSelectSummary">
      <ButtonBar>
        <Button onClick={edit}>Wijzigen</Button>
      </ButtonBar>
    </Wrapper>
  );
};

export default Summary;
