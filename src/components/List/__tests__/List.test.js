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
      container.querySelector('thead > tr > th:first-child').textContent
    ).toEqual('roles');
    expect(
      container.querySelector('thead > tr > th:nth-child(2)').textContent
    ).toEqual('username');
    expect(
      container.querySelector('thead > tr > th:nth-child(3)').textContent
    ).toEqual('id');
    expect(
      container.querySelector('thead > tr > th:nth-child(4)').textContent
    ).toEqual('is_active');
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
