// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import BackLink from '..';

describe('src/components/BackLink', () => {
  it('should render correctly', () => {
    const label = 'I am a backlink';
    const to = '/foo/bar/baz';
    const { container, getByText } = render(
      withAppContext(<BackLink to={to}>{label}</BackLink>)
    );

    expect(getByText(label)).toBeInTheDocument();

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toEqual(to);
  });
});
