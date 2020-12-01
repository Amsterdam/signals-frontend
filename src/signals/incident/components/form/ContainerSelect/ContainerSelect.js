import React, { useCallback, useState, useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Paragraph } from '@amsterdam/asc-ui';
import { ContainerSelectProvider } from './context';
import Intro from './Intro';
import Selector from './Selector';
import Summary from './Summary';

const ContainerSelect = ({ handler, parent }) => {
  const { value } = handler();
  const [showMap, setShowMap] = useState(false);

  const update = useCallback(
    selectedValue => {
      parent.meta.updateIncident({ extra_afvalcontainer: selectedValue });
    },
    [parent]
  );

  const edit = useCallback(
    event => {
      event.preventDefault();
      setShowMap(true);
    },
    [setShowMap]
  );

  const close = useCallback(
    event => {
      event.preventDefault();
      setShowMap(false);
    },
    [setShowMap]
  );

  return (
    <ContainerSelectProvider value={{ value, update, edit, close }}>
      {!showMap && !value && <Intro />}

      {showMap && <Selector />}

      {!showMap && value && <Summary />}

      <Paragraph as="h6">Geselecteerd: {value ? value : '<geen>'}</Paragraph>
    </ContainerSelectProvider>
  );
};

ContainerSelect.propTypes = {
  handler: PropTypes.func,
  parent: PropTypes.object,
};

export default ContainerSelect;
