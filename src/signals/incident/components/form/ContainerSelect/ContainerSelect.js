import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const ContainerSelect = ({ handler, meta, parent }) => {
  const { value } = handler();

  const handleChange = useCallback(
    event => {
      parent.meta.updateIncident({ });
    },
    [parent]
  );

  return (
    <div>
      This is the Afvalcontainer
      <div>Intro</div>
      <div>Selector</div>
      <div>Summary</div>
    </div>
  );
};

ContainerSelect.propTypes = {
  handler: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
};

export default ContainerSelect;
