import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { StyledTHead } from 'signals/settings/users/containers/Overview/components/DataView/styled';

import DataViewHeaderRow from './components/DataViewHeaderRow';

const DataViewHeader = ({ numberOfColumns, headers, filters }) => {
  const headersMissing = useMemo(
    () => numberOfColumns - headers.length,
    [numberOfColumns, headers.length]
  );
  const filtersMissing = useMemo(
    () =>  numberOfColumns - filters.length,
    [numberOfColumns, filters.length]
  );

  return (
    <StyledTHead data-testid="dataViewHeader">
      {headers.length > 0 && (
        <DataViewHeaderRow
          nodes={headers}
          spacer={headersMissing > 0}
          spacerColSpan={headersMissing > 1 ? headersMissing : undefined}
          testId="dataViewHeadersRow"
        />
      )}
      {filters.length > 0 && (
        <DataViewHeaderRow
          nodes={filters}
          spacer={filtersMissing > 0}
          spacerColSpan={filtersMissing > 1 ? filtersMissing : undefined}
          testId="dataViewFiltersRow"
        />
      )}
    </StyledTHead>
  );
};

DataViewHeader.defaultProps = {
  headers: [],
  filters: [],
};

DataViewHeader.propTypes = {
  numberOfColumns: PropTypes.number.isRequired,
  headers: PropTypes.node,
  filters: PropTypes.node,
};

export default DataViewHeader;
