import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { ContainerSelectProvider } from './context';
import Intro from './Intro';
import Selector from './Selector';
import Summary from './Summary';

const ContainerSelect = ({ handler, meta, parent }) => {
  const { value } = handler();
  const [showMap, setShowMap] = useState(false);

  const location = parent.meta?.incidentContainer?.incident?.location.geometrie.coordinates;

  const update = useCallback(
    selectedValue => {
      parent.meta.updateIncident({ extra_container: selectedValue });
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
    <ContainerSelectProvider value={{ selection: value, location, meta, update, edit, close }}>
      {!showMap && !value && <Intro />}

      {showMap && <Selector />}

      {!showMap && value && <Summary />}

    </ContainerSelectProvider>
  );
};

ContainerSelect.propTypes = {
  handler: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
};

export default ContainerSelect;
