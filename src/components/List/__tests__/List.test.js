import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { history, withAppContext, userObjects } from 'test/utils';

import List from '..';

const users = userObjects();

// temp disabled
describe.skip('components/List', () => {
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

  it('navigates on row click', () => {
    const primaryKeyColumn = 'id';
    const { container, rerender } = render(
      withAppContext(<List items={users} />)
    );

    fireEvent.click(container.querySelector('tbody > tr:nth-child(10)'));

    expect(history.location.pathname.endsWith('/')).toEqual(true);

    rerender(
      withAppContext(<List items={users} primaryKeyColumn={primaryKeyColumn} />)
    );

    fireEvent.click(container.querySelector('tbody > tr:nth-child(42)'));

    const primaryKey = users[41].id;

    expect(history.location.pathname.endsWith(`/${primaryKey}`)).toEqual(true);
  });
});
