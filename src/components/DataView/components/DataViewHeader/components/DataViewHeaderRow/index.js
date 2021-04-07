// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React from 'react';
import PropTypes from 'prop-types';

import { StyledTH, StyledTR } from 'components/DataView/styled';

const DataViewHeaderRow = ({ nodes, testId, spacer }) => (
  <StyledTR data-testid={testId}>
    {nodes.map((node, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <StyledTH key={idx} data-testid={`${testId}Heading`}>
        {node}
      </StyledTH>
    ))}
    {spacer > 0 && <StyledTH colSpan={spacer > 1 ? spacer : undefined} />}
  </StyledTR>
);

DataViewHeaderRow.defaultProps = {
  testId: 'dataViewHeaderRow',
  spacer: 0,
};

DataViewHeaderRow.propTypes = {
  nodes: PropTypes.node.isRequired,
  testId: PropTypes.string,
  spacer: PropTypes.number,
};

export default DataViewHeaderRow;
