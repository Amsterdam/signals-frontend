import React from 'react';
import { render, within, fireEvent } from '@testing-library/react';

import data from 'utils/__tests__/fixtures/filteredUserData.json';

import DataList from '..';

const columns = Object.keys(data[0]);
const tableWithDataList = (overrideProps = {}) => {
  const props = {
    data,
    ...overrideProps,
  };

  return (
    <table>
      <tbody>
        <DataList {...props} />
      </tbody>
    </table>
  );
};

const sortAlphabetic = (a, b) => {
  const _a = a.toLowerCase();
  const _b = b.toLowerCase();

  // eslint-disable-next-line no-nested-ternary
  return _a > _b ? 1 : _a < _b ? -1 : 0;
};

const sortAlphabeticReversed = (a, b) => {
  const _a = a.toLowerCase();
  const _b = b.toLowerCase();

  // eslint-disable-next-line no-nested-ternary
  return _a < _b ? 1 : _a > _b ? -1 : 0;
};

describe('signals/settings/users/containers/Overview/components/DataView/DataList', () => {
  it('should render correctly', () => {
    const { container } = render(tableWithDataList());

    expect(container).toBeInTheDocument();
  });

  it('should not render without data', () => {
    const { container, rerender } = render(
      tableWithDataList({ data: undefined })
    );

    expect(container).toBeInTheDocument();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(0);

    rerender(tableWithDataList( { data: null }));

    expect(container).toBeInTheDocument();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(0);

    rerender(tableWithDataList( { data: [] }));

    expect(container).toBeInTheDocument();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(0);
  });

  it('should render with data', () => {
    const { container, getByText } = render(tableWithDataList());

    expect(container.querySelectorAll('tbody tr')).toHaveLength(data.length);
    data.forEach(item => {
      // Only checking if we can at least find all IDs in the document.
      expect(getByText(String(item.id))).toBeInTheDocument();
    });
  });

  it('should render correct number of columns and in correct column order', () => {
    const alphabetic = [...columns].sort(sortAlphabetic);
    const alphabeticReversed = [...columns].sort(sortAlphabeticReversed);
    const expectOrder = (order, negate = false) => (row, rowIDX) => row.childNodes
      .forEach(
        (column, idx) => {
          const expectObj = negate ? expect(column).not : expect(column);

          expectObj.toHaveTextContent(data[rowIDX][order[idx]]);
        });
    const { container, rerender } = render(
      tableWithDataList()
    );

    let allDataRows = Array.from(container.querySelectorAll('tbody tr'));

    expect(allDataRows).toHaveLength(data.length);
    allDataRows.forEach(
      row => expect(row.childNodes).toHaveLength(columns.length)
    );
    allDataRows.forEach(expectOrder(alphabetic, true)); // Expect order not to match 'alphabetic'.

    rerender(
      tableWithDataList({ columnOrder: alphabetic })
    );

    allDataRows = Array.from(container.querySelectorAll('tbody tr'));

    expect(allDataRows).toHaveLength(data.length);
    allDataRows.forEach(
      row => expect(row.childNodes).toHaveLength(columns.length)
    );
    allDataRows.forEach(expectOrder(alphabetic));

    rerender(
      tableWithDataList({ columnOrder: alphabeticReversed })
    );

    allDataRows = Array.from(container.querySelectorAll('tbody tr'));

    expect(allDataRows).toHaveLength(data.length);
    allDataRows.forEach(
      row => expect(row.childNodes).toHaveLength(columns.length)
    );
    allDataRows.forEach(expectOrder(alphabeticReversed));
  });

  it('should not render invisible columns', () => {
    const invisibleColumns = columns.slice(0, 3);
    const { container, rerender } = render(
      tableWithDataList()
    );

    let allDataRows = Array.from(container.querySelectorAll('tbody tr'));

    expect(allDataRows).toHaveLength(data.length);
    allDataRows.forEach(
      row => expect(row.childNodes).toHaveLength(columns.length)
    );

    rerender(
      tableWithDataList({ invisibleColumns })
    );

    allDataRows = Array.from(container.querySelectorAll('tbody tr'));

    expect(allDataRows).toHaveLength(data.length);
    allDataRows.forEach(
      row => expect(row.childNodes).toHaveLength(columns.length - invisibleColumns.length)
    );
    allDataRows.forEach(
      (row, rowIDX) => invisibleColumns.forEach(
        invisibleColumn => {
          expect(within(row).queryByText(String(data[rowIDX][invisibleColumn]))).toBeNull();
        }
      )
    );
  });

  it('should render with onItemClick and primaryKeyColumn property', () => {
    const onItemClickHandler = jest.fn();
    const { container, rerender } = render(
      tableWithDataList()
    );

    expect(onItemClickHandler).toHaveBeenCalledTimes(0);

    let allRows = container.querySelectorAll('tbody tr');

    fireEvent.click(allRows[0]);

    expect(onItemClickHandler).toHaveBeenCalledTimes(0);
    allRows.forEach(
      row => expect(row.dataset.itemId).toBeUndefined()
    );

    rerender(
      tableWithDataList({ onItemClick: onItemClickHandler })
    );

    allRows = container.querySelectorAll('tbody tr');

    expect(onItemClickHandler).toHaveBeenCalledTimes(0);

    fireEvent.click(allRows[0]);

    expect(onItemClickHandler).toHaveBeenCalledTimes(1);

    rerender(
      tableWithDataList({ onItemClick: onItemClickHandler, primaryKeyColumn: columns[1] })
    );

    allRows = container.querySelectorAll('tbody tr');

    fireEvent.click(allRows[0]);

    expect(onItemClickHandler).toHaveBeenCalledTimes(2);
    allRows.forEach(
      (row, rowIDX) => expect(row.dataset.itemId).toBe(String(data[rowIDX][columns[1]]))
    );

    rerender(
      tableWithDataList({ onItemClick: onItemClickHandler, primaryKeyColumn: columns[0] })
    );

    allRows = container.querySelectorAll('tbody tr');

    fireEvent.click(allRows[0]);

    expect(onItemClickHandler).toHaveBeenCalledTimes(3);
    allRows.forEach(
      (row, rowIDX) => expect(row.dataset.itemId).toBe(String(data[rowIDX][columns[0]]))
    );
  });
});
