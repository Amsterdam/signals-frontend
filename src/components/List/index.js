import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useLocation, useHistory } from 'react-router-dom';

const StyledTD = styled.td`
  cursor: pointer;
`;

const List = ({ columnOrder, invisibleColumns, items, primaryKeyColumn, className }) => {
  const location = useLocation();
  const history = useHistory();

  if (!items.length) {
    return null;
  }

  const filterVisibleColumns = colHeader =>
    invisibleColumns.includes(colHeader) === false;

  const colHeaders =
    (columnOrder.length && columnOrder) || Object.keys(items[0]).filter(filterVisibleColumns);

  const onRowClick = e => {
    const { dataset } = e.currentTarget;
    const { itemId } = dataset;

    if (itemId) {
      history.push(`${location.pathname}/${itemId}`);
    }
  };

  return (
    <table cellPadding="0" cellSpacing="0" width="100%" className={className}>
      <thead>
        <tr>
          {colHeaders.map(colHeader => (
            <th key={colHeader}>{colHeader}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {items.map((row, rowIndex) => (
          <tr
            key={JSON.stringify(items[rowIndex])}
            data-item-id={primaryKeyColumn && items[rowIndex][primaryKeyColumn]}
            onClick={onRowClick}>
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
  primaryKeyColumn: undefined,
};

List.propTypes = {
  /** List of column names in the order of which they should be displayed */
  columnOrder: PropTypes.arrayOf(PropTypes.string),
  /** List of column names that should not be displayed */
  invisibleColumns: PropTypes.arrayOf(PropTypes.string),
  /** List of key/value pairs */
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  /** Name of the column that contains the value that is used to build the URL to navigate to on item click */
  primaryKeyColumn: PropTypes.string,
  className: PropTypes.string,
};

export default List;
