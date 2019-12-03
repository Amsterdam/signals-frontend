import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import * as reactRouterDom from 'react-router-dom';

import roles from 'utils/__tests__/fixtures/roles.json';
import { ROLES_URL } from 'signals/settings/routes';

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
      onSaveRole: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { container, queryByTestId } = render(withAppContext(<RoleForm {...props} />))

    expect(queryByTestId('rolesFormFieldName')).toHaveValue('behandelaars');

    expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(12);
    expect(container.querySelectorAll('input[type="checkbox"]:checked').length).toBe(2);
  });

  it('should trigger error in name field when it is empty', () => {
    props.role.name = '';
    const { getByTestId, queryByTestId, queryByText } = render(withAppContext(<RoleForm {...props} />))

    expect(queryByTestId('rolesFormFieldName')).toHaveValue('');
    expect(queryByText('Dit veld is verplicht')).toBeInTheDocument();

    const event = {
      target: {
        value: 'nieuwe behandelaars',
      },
    };
    fireEvent.blur(getByTestId('rolesFormFieldName'), event);

    expect(queryByTestId('rolesFormFieldName')).toHaveValue('nieuwe behandelaars');
    expect(queryByText('Dit veld is verplicht')).not.toBeInTheDocument();
  });

  it('should handle submit flow when patching an existing role', () => {
    const { getByTestId } = render(withAppContext(<RoleForm {...props} />))

    const event = {
      target: {
        value: 'behandelaars',
      },
    };
    fireEvent.blur(getByTestId('rolesFormFieldName'), event);

    fireEvent.click(getByTestId('submitBtn'), { preventDefault: jest.fn() });

    expect(props.onPatchRole).toHaveBeenCalledWith({
      id: 2,
      name: 'behandelaars',
      permission_ids: [110, 164],
    });
  });

  it('should handle submit flow when saving an new role', () => {
    props.role = undefined;
    const { getByTestId } = render(withAppContext(<RoleForm {...props} />))

    const event = {
      target: {
        value: 'nieuwe behandelaars',
      },
    };
    fireEvent.blur(getByTestId('rolesFormFieldName'), event);

    fireEvent.click(getByTestId('submitBtn'), { preventDefault: jest.fn() });

    expect(props.onSaveRole).toHaveBeenCalledWith({
      name: 'nieuwe behandelaars',
      permission_ids: [],
    });
  });

  it('should not do submit when form is invalid', () => {
    props.role.name = '';
    const { getByTestId } = render(withAppContext(<RoleForm {...props} />))

    fireEvent.click(getByTestId('submitBtn'), { preventDefault: jest.fn() });

    expect(props.onPatchRole).not.toHaveBeenCalled();
    expect(props.onSaveRole).not.toHaveBeenCalled();
  });

  it('should handle cancel flow', () => {
    const push = jest.fn();
    jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({ push }));

    const { getByTestId } = render(withAppContext(<RoleForm {...props} />))

    fireEvent.click(getByTestId('cancelBtn'));

    expect(props.onPatchRole).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith(ROLES_URL);
  });
});
