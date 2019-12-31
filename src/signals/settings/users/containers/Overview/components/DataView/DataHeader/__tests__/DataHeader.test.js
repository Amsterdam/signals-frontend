import React from 'react';
import { render } from '@testing-library/react';

import DataHeader from '..';

const labels = ['id', 'value'];

describe('signals/settings/users/containers/Overview/components/DataView/DataHeader', () => {
  it('should render correctly', () => {
    const { container } = render(
      <table>
        <thead>
          <DataHeader labels={labels} />
        </thead>
      </table>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render with zero or more labels', () => {
    const { rerender, getByTestId, getByText } = render(
      <table>
        <thead>
          <DataHeader labels={[]} />
        </thead>
      </table>
    );

    expect(getByTestId('dataViewHeaderRow')).toBeInTheDocument();

    rerender(
      <table>
        <thead>
          <DataHeader labels={labels} />
        </thead>
      </table>
    );

    expect(getByTestId('dataViewHeaderRow')).toBeInTheDocument();
    labels.forEach(label => {
      expect(getByText(label)).toBeInTheDocument();
    });
  });
});
