import React from 'react';
import { render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import IconList, { IconListItem } from './IconList';

describe('IconList', () => {
  it('should render', () => {
    render(
      withAppContext(
        <IconList>
          <IconListItem iconUrl="">Icon</IconListItem>
        </IconList>
      )
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBe(1);
  });

  it('should render an empty list', () => {
    render(withAppContext(<IconList />));

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
  });
});
