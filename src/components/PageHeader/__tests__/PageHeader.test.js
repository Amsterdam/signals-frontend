import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import PageHeader from '..';

describe('components/PageHeader', () => {
  it('renders required elements', () => {
    const { getByText } = render(
      withAppContext(
        <PageHeader title="I am a title">
          <span>I am a child</span>
        </PageHeader>,
      ),
    );

    // title
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(getByText('I am a title').tagName).toEqual('H1');

    // children
    expect(document.querySelectorAll('span')).toHaveLength(1);
  });

  it('renders a subtitle', () => {
    const subTitle = 'And me is subtitle';
    const { getByText } = render(
      withAppContext(
        <PageHeader title="I am a title" subTitle={subTitle}>
          <span>I am a child</span>
        </PageHeader>,
      ),
    );

    expect(getByText(subTitle)).toBeTruthy();
  });
});
