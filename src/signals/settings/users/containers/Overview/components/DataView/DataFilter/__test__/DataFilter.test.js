import React from 'react';
import { render } from '@testing-library/react';

import DataFilter from '..';

const TEXT_FILTER = 'test filter';
const renderDiv = text => <div key="testKey">{text}</div>;

describe('signals/settings/users/containers/Overview/components/DataView/DataFilter', () => {
  it('should render correctly', () => {
    const { container } = render(
      <table>
        <thead>
          <DataFilter />
        </thead>
      </table>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render not render DataFilter without children', () => {
    const { queryByTestId } = render(
      <table>
        <thead>
          <DataFilter />
        </thead>
      </table>
    );

    expect(queryByTestId('dataViewFilterRow')).toBeNull();
  });

  it('should render DataFilter with one or more children', () => {
    const { rerender, getByTestId, queryAllByText } = render(
      <table>
        <thead>
          <DataFilter>
            {renderDiv(TEXT_FILTER)}
          </DataFilter>
        </thead>
      </table>
    );

    expect(getByTestId('dataViewFilterRow')).toBeInTheDocument();
    expect(queryAllByText(TEXT_FILTER)).toHaveLength(1);

    rerender(
      <table>
        <thead>
          <DataFilter>
            {renderDiv(TEXT_FILTER)}
            {renderDiv(TEXT_FILTER)}
          </DataFilter>
        </thead>
      </table>
    );

    expect(getByTestId('dataViewFilterRow')).toBeInTheDocument();
    expect(queryAllByText(TEXT_FILTER)).toHaveLength(2);
  });

  it('should render extra th if number of filters less than headersLength', () => {
    const filters = new Array(3).fill(renderDiv(TEXT_FILTER));
    const { container, rerender, getByTestId, queryAllByText } = render(
      <table>
        <thead>
          <DataFilter
            headersLength={filters.length}
          >
            {filters}
          </DataFilter>
        </thead>
      </table>
    );

    expect(getByTestId('dataViewFilterRow')).toBeInTheDocument();
    expect(container.querySelectorAll('th')).toHaveLength(filters.length);
    expect(queryAllByText(TEXT_FILTER)).toHaveLength(filters.length);

    rerender(
      <table>
        <thead>
          <DataFilter
            headersLength={filters.length - 1}
          >
            {filters}
          </DataFilter>
        </thead>
      </table>
    );

    expect(getByTestId('dataViewFilterRow')).toBeInTheDocument();
    expect(container.querySelectorAll('th')).toHaveLength(filters.length);
    expect(queryAllByText(TEXT_FILTER)).toHaveLength(filters.length);

    rerender(
      <table>
        <thead>
          <DataFilter
            headersLength={filters.length + 1}
          >
            {filters}
          </DataFilter>
        </thead>
      </table>
    );

    let allTHs = container.querySelectorAll('th');
    let lastTH = Array.from(allTHs).slice(-1)[0];

    expect(getByTestId('dataViewFilterRow')).toBeInTheDocument();
    expect(allTHs).toHaveLength(filters.length + 1);
    expect(lastTH).not.toHaveAttribute('colspan');
    expect(queryAllByText(TEXT_FILTER)).toHaveLength(filters.length);

    rerender(
      <table>
        <thead>
          <DataFilter
            headersLength={filters.length + 5}
          >
            {filters}
          </DataFilter>
        </thead>
      </table>
    );

    allTHs = container.querySelectorAll('th');
    lastTH = Array.from(allTHs).slice(-1)[0];

    expect(getByTestId('dataViewFilterRow')).toBeInTheDocument();
    expect(allTHs).toHaveLength(filters.length + 1);
    expect(lastTH).toHaveAttribute('colspan', String(5));
    expect(queryAllByText(TEXT_FILTER)).toHaveLength(filters.length);
  });
});
