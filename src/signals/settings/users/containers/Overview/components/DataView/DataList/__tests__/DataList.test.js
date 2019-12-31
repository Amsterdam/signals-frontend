import React from 'react';
import { render } from '@testing-library/react';

import DataList from '..';

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

describe('signals/settings/users/containers/Overview/components/DataView/DataList', () => {
  it('should render correctly', () => {
    const { container } = render(<DataList />);

    expect(container).toBeInTheDocument();
  });

  it('should not render without data', () => {
    const { debug, container, rerender } = render(<DataList />);

    expect(container).toBeInTheDocument();

    debug();

    rerender(
      <DataList />
    );
  });
});
