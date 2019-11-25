import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import * as reactRouterDom from 'react-router-dom';

import roles from 'utils/__tests__/fixtures/roles.json';

import RolesForm from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({}),
}));

describe('/signals/settings/roles/components/RolesForm', () => {
  let props = {};

  beforeEach(() => {
    props = {
      id: '2',
      list: roles.list,
      permissions: roles.permissions,
      onPatchRole: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { container, queryByTestId } = render(withAppContext(<RolesForm {...props} />))

    expect(container.querySelector('h1')).toHaveTextContent(/^Rol instellingen$/);

    expect(queryByTestId('rolesFormFieldName')).toHaveValue('behandelaars');

    expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(12);
    expect(container.querySelectorAll('input[type="checkbox"]:checked').length).toBe(2);
  });

  it('should handle change name', () => {
    const { getByTestId, queryByTestId } = render(withAppContext(<RolesForm {...props} />))

    expect(queryByTestId('rolesFormFieldName')).toHaveValue('behandelaars');

    const event = {
      target: {
        value: 'nieuwe behandelaars',
      },
    };
    fireEvent.change(getByTestId('rolesFormFieldName'), event);

    expect(queryByTestId('rolesFormFieldName')).toHaveValue('nieuwe behandelaars');
  });

  it('should handle submit flow', () => {
    const push = jest.fn();
    jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({ push }));

    const { getByTestId } = render(withAppContext(<RolesForm {...props} />))

    fireEvent.click(getByTestId('rolesFormButtonSubmit'));

    expect(push).toHaveBeenCalledWith('/instellingen/rollen');
    expect(props.onPatchRole).toHaveBeenCalledWith({
      id: 2,
      patch: {
        id: 2,
        name: 'behandelaars',
        permission_ids: [110, 164],
      },
    });
  });

  it('should handle cancel flow', () => {
    const push = jest.fn();
    jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({ push }));

    const { getByTestId } = render(withAppContext(<RolesForm {...props} />))

    fireEvent.click(getByTestId('rolesFormButtonCancel'));

    expect(props.onPatchRole).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/instellingen/rollen');
  });
});
