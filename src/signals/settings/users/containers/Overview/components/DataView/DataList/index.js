import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { StyledTR, StyledTD } from '../styled';

const DataList = ({
  columnOrder,
  invisibleColumns,
  data,
  onItemClick,
  primaryKeyColumn,
}) => {
  if (!data) return null;

  const filterVisibleColumns = colHeader => invisibleColumns.includes(colHeader) === false;
  const colHeaders = (columnOrder.length && columnOrder) || Object.keys(data[0] || []).filter(filterVisibleColumns);

  return (
    <Fragment>
      {data.map((row, rowIndex) => (
        <StyledTR
          key={JSON.stringify(data[rowIndex])}
          data-item-id={primaryKeyColumn && data[rowIndex][primaryKeyColumn]}
          onClick={onItemClick}
        >
          {colHeaders.filter(filterVisibleColumns).map(col => (
            // eslint-disable-next-line react/no-array-index-key
            <StyledTD key={JSON.stringify(col)}>{row[col]}</StyledTD>
          ))}
        </StyledTR>
      ))}
    </Fragment>
  );
};

DataList.defaultProps = {
  columnOrder: [],
  invisibleColumns: [],
  onItemClick: null,
  primaryKeyColumn: undefined,
};

DataList.propTypes = {
  /** Array of data to be displayed */
  data: PropTypes.array.isRequired,
  /** List of column names in the order of which they should be displayed */
  columnOrder: PropTypes.arrayOf(PropTypes.string),
  /** List of column names that should not be displayed */
  invisibleColumns: PropTypes.arrayOf(PropTypes.string),
  /** Row click callback handler */
  onItemClick: PropTypes.func,
  /** Name of the column that contains the value that is used to build the URL to navigate to on item click */
  primaryKeyColumn: PropTypes.string,
};

export default DataList;
