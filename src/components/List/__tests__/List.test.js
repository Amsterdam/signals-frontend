import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { history, withAppContext } from 'test/utils';
import isObject from 'lodash.isobject';
import users from 'utils/__tests__/fixtures/users.json';

import List from '..';

const userObjects = users.results.map(item =>
  Object.keys(item)
    .filter(key => !key.startsWith('_'))
    .filter(key => !isObject(item[key]))
    .reduce((rawObj, key) => {
      const obj = { ...rawObj };

      obj[key] = item[key];

      return obj;
    }, {})
);

describe('components/List', () => {
  it('returns null when there are no items to render', () => {
    const { container, rerender } = render(withAppContext(<List items={[]} />));

    expect(container.querySelector('table')).toBeFalsy();

    rerender(withAppContext(<List items={userObjects} />));

    expect(container.querySelector('table')).toBeTruthy();
  });

  it('renders column in the correct order', () => {
    const columnOrder = ['roles', 'username', 'id', 'is_active'];
    const { container } = render(
      withAppContext(<List items={userObjects} columnOrder={columnOrder} />)
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
      withAppContext(<List items={userObjects} invisibleColumns={['id']} />)
    );

    container.querySelectorAll('thead td').forEach(element => {
      expect(element.textContent).not.toEqual('id');
    });
  });

  it('navigates on row click', () => {
    const primaryKeyColumn = 'id';
    const { container, rerender } = render(
      withAppContext(<List items={userObjects} />)
    );

    fireEvent.click(container.querySelector('tbody > tr:nth-child(10)'));

    expect(history.location.pathname.endsWith('/')).toEqual(true);

    rerender(
      withAppContext(<List items={userObjects} primaryKeyColumn={primaryKeyColumn} />)
    );

    fireEvent.click(container.querySelector('tbody > tr:nth-child(42)'));

    const primaryKey = userObjects[41].id;

    expect(history.location.pathname.endsWith(`/${primaryKey}`)).toEqual(true);
  });
});
