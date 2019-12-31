import React from 'react';
import PropTypes from 'prop-types';

import { StyledTR, StyledTH } from '../styled';

const DataHeader = ({ labels }) => (
  <StyledTR data-testid="dataViewHeaderRow">
    {labels.map(label => (
      <StyledTH key={label}>
        {label}
      </StyledTH>
    ))}
  </StyledTR>
);

DataHeader.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DataHeader;
