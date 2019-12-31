import React from 'react';
import PropTypes from 'prop-types';

import { StyledTR, StyledTH } from '../styled';

const DataFilter = ({ headersLength, children }) => {
  if (!children) return null;

  const getFilters = () => {
    if (children.length) {
      return children.map((filter, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <StyledTH key={idx}>
          {filter}
        </StyledTH>
      ));
    }

    return [(
      <StyledTH key={0}>
        {children}
      </StyledTH>
    )];
  };

  const filters = getFilters();
  const colSpan = Math.max(headersLength - filters.length, 0); // Make sure we have a positive integer or 0.

  return (
    <StyledTR data-testid="dataViewFilterRow">
      {filters}
      {colSpan > 0 && <StyledTH key={filters.length} colSpan={colSpan > 1 ? colSpan : undefined} />}
    </StyledTR>
  );
};

DataFilter.defaultProps = {
  headersLength: 0,
};

DataFilter.propTypes = {
  children: PropTypes.node.isRequired,
  headersLength: PropTypes.number,
};


export default DataFilter;
