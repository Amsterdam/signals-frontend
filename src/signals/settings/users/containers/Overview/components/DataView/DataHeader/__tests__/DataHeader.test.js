import React from 'react';
import { render } from '@testing-library/react';

import DataHeader from '..';

const labels = ['id', 'value'];
const tableWithDataHeader = (overrideProps = {}) => {
  const props = {
    labels,
    ...overrideProps,
  };

  return (
    <table>
      <thead>
        <DataHeader {...props} />
      </thead>
    </table>
  );
};

describe('signals/settings/users/containers/Overview/components/DataView/DataHeader', () => {
  it('should render correctly', () => {
    const { container } = render(tableWithDataHeader());

    expect(container).toBeInTheDocument();
  });

  it('should render with zero or more labels', () => {
    const { rerender, getByTestId, getByText } = render(
      tableWithDataHeader({ labels: [] })
    );

    expect(getByTestId('dataViewHeaderRow')).toBeInTheDocument();

    rerender(tableWithDataHeader());

    expect(getByTestId('dataViewHeaderRow')).toBeInTheDocument();
    labels.forEach(label => {
      expect(getByText(label)).toBeInTheDocument();
    });
  });
});
