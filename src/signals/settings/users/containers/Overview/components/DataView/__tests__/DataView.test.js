import React from 'react';
import { render } from '@testing-library/react';

import DataView from '..';
import DataHeader from '../DataHeader';
import DataFilter from '../DataFilter';
import DataList from '../DataList';

const renderDiv = text => <div>{text}</div>;
const TEXT_NOT_ALLOWED = 'not allowed children';
const TEXT_FILTER = 'test filter';
const data = [
  {
    id: 123,
    value: 'some value',
  },
  {
    id: 321,
    value: 'some other value',
  },
];

describe('signals/settings/users/containers/Overview/components/DataView', () => {
  it('should render correctly', () => {
    const { container } = render(<DataView />);

    expect(container).toBeInTheDocument();
  });

  it('should not render DataView without children', () => {
    const { container, queryByTestId } = render(<DataView />);

    expect(container).toBeInTheDocument();
    expect(queryByTestId('dataView')).toBeNull();
  });

  it('should not render DataView with non allowed children', () => {
    const TEXT_TEST_NODE = 'test node';
    const { container, rerender, queryByText, queryByTestId } = render(
      <DataView>
        <div>{TEXT_TEST_NODE}</div>
      </DataView>
    );

    expect(container).toBeInTheDocument();
    expect(queryByTestId('dataView')).toBeNull();

    rerender(
      <DataView>
        {renderDiv(TEXT_TEST_NODE)}
      </DataView>
    );

    expect(container).toBeInTheDocument();
    expect(queryByText(TEXT_TEST_NODE)).toBeNull();
    expect(queryByTestId('dataView')).toBeNull();
  });

  it('should render only allowed nodes and only one of each type', () => {
    const { rerender, queryAllByText, queryAllByTestId } = render(
      <DataView>
        <DataHeader labels={[]} />

        {renderDiv(TEXT_NOT_ALLOWED)}

        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>

        {renderDiv(TEXT_NOT_ALLOWED)}

        <DataList
          data={data}
        />

        {renderDiv(TEXT_NOT_ALLOWED)}
      </DataView>
    );

    expect(queryAllByTestId('dataView')).toHaveLength(1);
    expect(queryAllByTestId('dataViewHeaderRow')).toHaveLength(1);
    expect(queryAllByTestId('dataViewFilterRow')).toHaveLength(1);
    expect(queryAllByText(TEXT_FILTER)).toHaveLength(1);
    Object.keys(data[0]).forEach(key => {
      expect(queryAllByText(String(data[0][key]))).toHaveLength(1);
    });
    expect(queryAllByText(TEXT_NOT_ALLOWED)).toHaveLength(0);

    rerender(
      <DataView>
        <DataHeader labels={[]} />

        <DataHeader labels={[]} />

        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>

        <DataList
          data={data}
        />

        <DataList
          data={data}
        />

        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>
      </DataView>
    );

    expect(queryAllByTestId('dataView')).toHaveLength(1);
    expect(queryAllByTestId('dataViewHeaderRow')).toHaveLength(1);
    expect(queryAllByTestId('dataViewFilterRow')).toHaveLength(1);
    expect(queryAllByText(TEXT_FILTER)).toHaveLength(1);
    Object.keys(data[0]).forEach(key => {
      expect(queryAllByText(String(data[0][key]))).toHaveLength(1);
    });
  });

  it('should render headers and filters in <THEAD> before data in <TBODY>', () => {
    const { rerender, getByTestId, getByText } = render(
      <DataView>
        <DataHeader labels={[]} />

        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>

        <DataList
          data={data}
        />
      </DataView>
    );

    const dataView = getByTestId('dataView');

    expect(dataView.childNodes).toHaveLength(2);
    expect(dataView.childNodes[0].tagName).toBe('THEAD');
    expect(dataView.childNodes[0].childNodes).toHaveLength(2);
    expect(dataView.childNodes[1].tagName).toBe('TBODY');
    Object.keys(data[0]).forEach(key => {
      expect(getByText(String(data[0][key]))).toBeInTheDocument();
    });

    rerender(
      <DataView>
        <DataList
          data={data}
        />

        <DataHeader labels={[]} />

        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>
      </DataView>
    );

    expect(dataView.childNodes).toHaveLength(2);
    expect(dataView.childNodes[0].tagName).toBe('THEAD');
    expect(dataView.childNodes[0].childNodes).toHaveLength(2);
    expect(dataView.childNodes[1].tagName).toBe('TBODY');
    Object.keys(data[0]).forEach(key => {
      expect(getByText(String(data[0][key]))).toBeInTheDocument();
    });

    rerender(
      <DataView>
        <DataHeader labels={[]} />

        <DataList
          data={data}
        />

        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>
      </DataView>
    );

    expect(dataView.childNodes).toHaveLength(2);
    expect(dataView.childNodes[0].tagName).toBe('THEAD');
    expect(dataView.childNodes[0].childNodes).toHaveLength(2);
    expect(dataView.childNodes[1].tagName).toBe('TBODY');
    Object.keys(data[0]).forEach(key => {
      expect(getByText(String(data[0][key]))).toBeInTheDocument();
    });
  });

  it('should render without headers or filters and without data', () => {
    const { rerender, getByTestId } = render(
      <DataView>
        <DataHeader labels={[]} />

        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>
      </DataView>
    );

    const dataView = getByTestId('dataView');

    expect(dataView.childNodes).toHaveLength(1);
    expect(dataView.childNodes[0].tagName).toBe('THEAD');

    rerender(
      <DataView>
        <DataList
          data={data}
        />
      </DataView>
    );

    expect(dataView.childNodes).toHaveLength(1);
    expect(dataView.childNodes[0].tagName).toBe('TBODY');
  });

  it('should render headers and filters in given order', () => {
    const { container, rerender } = render(
      <DataView>
        <DataHeader labels={[]} />

        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>
      </DataView>
    );

    const tableHead = container.querySelector('thead');

    expect(tableHead.childNodes).toHaveLength(2);
    expect(tableHead.childNodes[0].dataset.testid).toBe('dataViewHeaderRow');
    expect(tableHead.childNodes[1].dataset.testid).toBe('dataViewFilterRow');

    rerender(
      <DataView>
        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>

        <DataHeader labels={[]} />
      </DataView>
    );

    expect(tableHead.childNodes).toHaveLength(2);
    expect(tableHead.childNodes[0].dataset.testid).toBe('dataViewFilterRow');
    expect(tableHead.childNodes[1].dataset.testid).toBe('dataViewHeaderRow');

    rerender(
      <DataView>
        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>

        <DataList
          data={data}
        />

        <DataHeader labels={[]} />
      </DataView>
    );

    expect(tableHead.childNodes).toHaveLength(2);
    expect(tableHead.childNodes[0].dataset.testid).toBe('dataViewFilterRow');
    expect(tableHead.childNodes[1].dataset.testid).toBe('dataViewHeaderRow');

    rerender(
      <DataView>
        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>

        <DataList
          data={data}
        />

        <DataHeader labels={[]} />
      </DataView>
    );

    expect(tableHead.childNodes).toHaveLength(2);
    expect(tableHead.childNodes[0].dataset.testid).toBe('dataViewFilterRow');
    expect(tableHead.childNodes[1].dataset.testid).toBe('dataViewHeaderRow');
  });

  it('should render with only headers or only filters', () => {
    const { container, rerender } = render(
      <DataView>
        <DataHeader labels={[]} />
      </DataView>
    );

    const tableHead = container.querySelector('thead');

    expect(tableHead.childNodes).toHaveLength(1);
    expect(tableHead.childNodes[0].dataset.testid).toBe('dataViewHeaderRow');

    rerender(
      <DataView>
        <DataFilter>
          {renderDiv(TEXT_FILTER)}
        </DataFilter>
      </DataView>
    );

    expect(tableHead.childNodes).toHaveLength(1);
    expect(tableHead.childNodes[0].dataset.testid).toBe('dataViewFilterRow');
  });
});
