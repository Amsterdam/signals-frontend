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
  display: flex;
`;

const Selector = () => {
  const { update, close } = useContext(ContainerSelectContext);

  const addContainer = useCallback(
    event => {
      event.preventDefault();
      update('PL734');
    },
    [update]
  );

  const removeContainer = useCallback(
    event => {
      event.preventDefault();
      update(null);
    },
    [update]
  );

  return (
    <Wrapper data-testid="containerSelectSelector">
      <ButtonBar>
        <Button onClick={addContainer}>Container toevoegen</Button>
        <Button onClick={removeContainer}>Container verwijderen</Button>
        <Button onClick={close}>Meld deze container/Sluiten</Button>
      </ButtonBar>
    </Wrapper>
  );
};

export default Selector;
