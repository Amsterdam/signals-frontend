import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useLocation, useHistory } from 'react-router-dom';

const StyledTD = styled.td`
  cursor: pointer;
`;

const List = ({ columnOrder, invisibleColumns, items, primaryKeyColumn }) => {
  const location = useLocation();
  const history = useHistory();

  if (!items.length) {
    return null;
  }

  const filterVisibleColumns = colHeader =>
    invisibleColumns.includes(colHeader) === false;

  const colHeaders =
    columnOrder || Object.keys(items[0]).filter(filterVisibleColumns);

  const onRowClick = e => {
    const { dataset } = e.currentTarget;
    const { itemId } = dataset;

    if (itemId) {
      const parts = location.pathname
        .split('/')
        .filter(Boolean)
        .join('/'); // getting rid of potential trailing slash

      history.push(`/${parts}/${itemId}`);
    }
  };

  return (
    <table cellPadding="0" cellSpacing="0" width="100%">
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
  columnOrder: undefined,
  invisibleColumns: [],
  primaryKeyColumn: undefined,
};

List.propTypes = {
  columnOrder: PropTypes.arrayOf(PropTypes.string),
  invisibleColumns: PropTypes.arrayOf(PropTypes.string),
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  primaryKeyColumn: PropTypes.string,
};

export default List;
