import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import PageHeader from '..';

describe('settings/components/PageHeader', () => {
  it('renders correctly', () => {
    const { getByText } = render(withAppContext(
      <PageHeader title="Foo bar baz" />
    ));

    expect(getByText('Foo bar baz')).toBeTruthy();
  });
});
