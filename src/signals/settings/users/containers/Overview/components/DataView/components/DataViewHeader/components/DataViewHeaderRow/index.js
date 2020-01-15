import React from 'react';
import PropTypes from 'prop-types';

import { StyledTH, StyledTR } from 'signals/settings/users/containers/Overview/components/DataView/styled';

const DataViewHeaderRow = ({ nodes, testId, spacer, spacerColSpan }) => (
  <StyledTR data-testid={testId}>
    {nodes.map((node, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <StyledTH key={idx} data-testid={`${testId}Heading`}>
        {node}
      </StyledTH>
    ))}
    {spacer && <StyledTH colSpan={spacerColSpan} />}
  </StyledTR>
);


DataViewHeaderRow.defaultProps = {
  testId: 'dataViewHeaderRow',
  spacer: false,
  spacerColSpan: undefined,
};

DataViewHeaderRow.propTypes = {
  nodes: PropTypes.node.isRequired,
  testId: PropTypes.string,
  spacer: PropTypes.bool,
  spacerColSpan: PropTypes.number,
};

export default DataViewHeaderRow;
