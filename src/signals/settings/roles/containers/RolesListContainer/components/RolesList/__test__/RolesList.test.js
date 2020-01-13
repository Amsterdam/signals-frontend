import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import * as reactRouterDom from 'react-router-dom';
import roles from 'utils/__tests__/fixtures/roles.json';
import { ROLE_URL } from 'signals/settings/routes';

import RolesList from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({}),
}));

describe('signals/settings/roles/containers/RolesListContainer/components/RolesList', () => {
  let props = {};

  beforeEach(() => {
    props = {
      list: roles.list,
    };
  });

  it('should render correctly', () => {
    const { container, rerender } = render(
      withAppContext(<RolesList {...props} />)
    );

    expect(container.querySelector('table')).toBeTruthy();

    expect(
      container.querySelector('tr:nth-child(1) td:nth-child(1)')
    ).toHaveTextContent(/^behandelaars$/);
    expect(
      container.querySelector('tr:nth-child(1) td:nth-child(2)')
    ).toHaveTextContent(
      /^Can read from SIA, Can change the status of a signal$/
    );

    expect(
      container.querySelector('tr:nth-child(2) td:nth-child(1)')
    ).toHaveTextContent(/^coordinatoren$/);
    expect(
      container.querySelector('tr:nth-child(2) td:nth-child(2)')
    ).toHaveTextContent(/^$/);

    props.list = [];
    rerender(withAppContext(<RolesList {...props} />));

    expect(container.querySelector('table')).toBeFalsy();
  });

  it('should click to role detail page', () => {
    const push = jest.fn();
    jest
      .spyOn(reactRouterDom, 'useHistory')
      .mockImplementationOnce(() => ({ push }));

    const { container } = render(withAppContext(<RolesList {...props} />));
    const event = { currentTarget: { getAttribute: () => 2 } };

    fireEvent.click(
      container.querySelector('tr:nth-child(1) td:nth-child(1)'),
      event
    );

    expect(push).toHaveBeenCalledWith(`${ROLE_URL}/2`);
  });

  it('should have disabled links', () => {
    const push = jest.fn();
    jest
      .spyOn(reactRouterDom, 'useHistory')
      .mockImplementationOnce(() => ({ push }));

    const { container } = render(withAppContext(<RolesList {...props} linksEnabled={false} />));
    const event = { currentTarget: { getAttribute: () => 2 } };

    expect(push).not.toHaveBeenCalled();

    fireEvent.click(
      container.querySelector('tr:nth-child(1) td:nth-child(1)'),
      event
    );

    expect(push).not.toHaveBeenCalled();
  });
});
