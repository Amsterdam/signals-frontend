import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import TextArea from '..';

describe('components/TextArea', () => {
  it('renders correctly', () => {
    const { container } = render(
      withAppContext(<TextArea cols="40" rows="5" className="txtArea" />),
    );

    expect(container.querySelector('textarea[cols="40"][rows="5"].txtArea')).toBeTruthy();
  });
});
