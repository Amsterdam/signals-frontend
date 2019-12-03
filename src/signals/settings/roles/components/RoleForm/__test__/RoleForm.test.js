import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import * as reactRouterDom from 'react-router-dom';

import roles from 'utils/__tests__/fixtures/roles.json';

import RoleForm from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({}),
}));

describe('/signals/settings/roles/components/RoleForm', () => {
  let props = {};

  beforeEach(() => {
    props = {
      role: roles.list[0],
      permissions: roles.permissions,
      onPatchRole: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { container, queryByTestId } = render(withAppContext(<RoleForm {...props} />))

    expect(queryByTestId('rolesFormForm')).toBeInTheDocument();
    expect(queryByTestId('rolesFormFieldName')).toHaveValue('behandelaars');

    expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(12);
    expect(container.querySelectorAll('input[type="checkbox"]:checked').length).toBe(2);
  });

  it('should enable the submit button when the form is valid and should handle submit flow', () => {
    props.role.name = '';
    const { getByTestId, queryByTestId } = render(withAppContext(<RoleForm {...props} />))

    expect(queryByTestId('rolesFormFieldName')).toHaveValue('');
    expect(queryByTestId('rolesFormButtonSubmit')).toBeDisabled();

    const event = {
      target: {
        value: 'nieuwe behandelaars',
      },
    };
    fireEvent.change(getByTestId('rolesFormFieldName'), event);

    expect(queryByTestId('rolesFormFieldName')).toHaveValue('nieuwe behandelaars');
    expect(queryByTestId('rolesFormButtonSubmit')).toBeEnabled();
  });

  it('should handle submit flow', () => {
    const push = jest.fn();
    jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({ push }));

    const { getByTestId, queryByTestId } = render(withAppContext(<RoleForm {...props} />))

    const event = {
      target: {
        value: 'behandelaars',
      },
    };
    fireEvent.change(getByTestId('rolesFormFieldName'), event);

    expect(queryByTestId('rolesFormButtonSubmit')).toBeEnabled();
    fireEvent.click(getByTestId('rolesFormButtonSubmit'), { preventDefault: jest.fn() });

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

    const { getByTestId } = render(withAppContext(<RoleForm {...props} />))

    fireEvent.click(getByTestId('rolesFormButtonCancel'));

    expect(props.onPatchRole).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/instellingen/rollen');
  });
});
