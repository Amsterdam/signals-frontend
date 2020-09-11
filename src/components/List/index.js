import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledTH = styled.th`
  text-align: left;
`;

const StyledTD = styled.td`
  cursor: pointer;
`;

const List = ({ columnOrder, invisibleColumns, items, onItemClick, primaryKeyColumn, className }) => {
  const filterVisibleColumns = useCallback(colHeader => invisibleColumns.includes(colHeader) === false, [
    invisibleColumns,
  ]);

  const colHeaders = useMemo(
    () => (columnOrder.length && columnOrder) || Object.keys(items[0]).filter(filterVisibleColumns),
    [columnOrder, filterVisibleColumns, items]
  );

  if (!items.length) {
    return null;
  }

  return (
    <table cellPadding="0" cellSpacing="0" width="100%" className={className}>
      <thead>
        <tr>
          {colHeaders.map(colHeader => (
            <StyledTH key={colHeader}>{colHeader}</StyledTH>
          ))}
        </tr>
      </thead>

      <tbody>
        {items.map((row, rowIndex) => (
          <tr
            key={JSON.stringify(items[rowIndex])}
            data-item-id={primaryKeyColumn && items[rowIndex][primaryKeyColumn]}
            onClick={onItemClick}
          >
            {colHeaders.filter(filterVisibleColumns).map(col => (
              // eslint-disable-next-line react/no-array-index-key
              <StyledTD key={JSON.stringify(col)}>{row[col]}</StyledTD>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

List.defaultProps = {
  columnOrder: [],
  invisibleColumns: [],
  onItemClick: null,
  primaryKeyColumn: undefined,
};

List.propTypes = {
  className: PropTypes.string,
  /** List of column names in the order of which they should be displayed */
  columnOrder: PropTypes.arrayOf(PropTypes.string),
  /** List of column names that should not be displayed */
  invisibleColumns: PropTypes.arrayOf(PropTypes.string),
  /** List of key/value pairs */
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  /** Row click callback handler */
  onItemClick: PropTypes.func,
  /** Name of the column that contains the value that is used to build the URL to navigate to on item click */
  primaryKeyColumn: PropTypes.string,
};

export default List;
