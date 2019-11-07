import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext, userObjects } from 'test/utils';

import List from '..';

const users = userObjects();

describe('components/List', () => {
  it('returns null when there are no items to render', () => {
    const { container, rerender } = render(withAppContext(<List items={[]} />));

    expect(container.querySelector('table')).toBeFalsy();

    rerender(withAppContext(<List items={users} />));

    expect(container.querySelector('table')).toBeTruthy();
  });

  it('renders column in the correct order', () => {
    const columnOrder = ['roles', 'username', 'id', 'is_active'];
    const { container } = render(
      withAppContext(<List items={users} columnOrder={columnOrder} />)
    );

    expect(
      [...container.querySelectorAll('th')].map(header => header.textContent)
    ).toEqual(columnOrder);
  });

  it('does not render columns marked as invisible', () => {
    const { container } = render(
      withAppContext(<List items={users} invisibleColumns={['id']} />)
    );

    container.querySelectorAll('thead td').forEach(element => {
      expect(element.textContent).not.toEqual('id');
    });
  });
});
