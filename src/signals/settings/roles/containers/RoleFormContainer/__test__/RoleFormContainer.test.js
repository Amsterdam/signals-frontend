import React from 'react';
import { render } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { withAppContext } from 'test/utils';
import roles from 'utils/__tests__/fixtures/roles.json';

import { PATCH_ROLE, SAVE_ROLE } from 'models/roles/constants';
import { RoleFormContainer, mapDispatchToProps } from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
}));

describe('signals/settings/roles/containers/RoleFormContainer', () => {
  const props = {
    roles: {
      list: roles.list,
      permissions: [],
      loading: false,
      loadingPermissions: false,
      responseSuccess: false,
      responseError: false,
    },
    onFetchRoles: jest.fn(),
    onFetchPermissions: jest.fn(),
    onPatchRole: jest.fn(),
    onSaveRole: jest.fn(),
    userCan: jest.fn(() => true),
  };

  it('should lazy load form correctly', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      roleId: undefined,
    }));

    const loadingProps = {
      ...props,
      roles: {
        ...props.roles,
        loading: true,
      },
    };
    const { container, queryByTestId, rerender } = render(
      withAppContext(<RoleFormContainer {...loadingProps} />)
    );

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();
    expect(queryByTestId('rolesForm')).not.toBeInTheDocument();

    const notLoadingProps = {
      ...props,
      roles: {
        ...props.roles,
        loading: false,
        loadingPermissions: false,
      },
    };
    rerender(withAppContext(<RoleFormContainer {...notLoadingProps} />));

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
    expect(queryByTestId('rolesForm')).toBeInTheDocument();
    expect(container.querySelector('h1')).toHaveTextContent(
      /^Rol toevoegen$/
    );
  });

  it('should load form with existing role correctly', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      roleId: '2',
    }));

    const notLoadingProps = {
      ...props,
      roles: {
        ...props.roles,
        loading: false,
        loadingPermissions: false,
      },
    };
    const { container, queryByTestId } = render(
      withAppContext(<RoleFormContainer {...notLoadingProps} />)
    );

    expect(queryByTestId('rolesForm')).toBeInTheDocument();
    expect(container.querySelector('h1')).toHaveTextContent(
      /^Rol wijzigen$/
    );
  });

  it('should show success message', () => {
    props.roles.responseSuccess = true;
    const { getByText } = render(
      withAppContext(<RoleFormContainer {...props} />)
    );

    expect(getByText('Gegevens opgeslagen')).toBeInTheDocument();
  });

  it('should show error message', () => {
    props.roles.responseError = true;
    const { getByText } = render(
      withAppContext(<RoleFormContainer {...props} />)
    );

    expect(
      getByText('Er is iets mis gegaan bij het opslaan')
    ).toBeInTheDocument();
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onPatchRole', () => {
      mapDispatchToProps(dispatch).onPatchRole();
      expect(dispatch).toHaveBeenCalledWith({ type: PATCH_ROLE });
    });

    it('onSaveRole', () => {
      mapDispatchToProps(dispatch).onSaveRole();
      expect(dispatch).toHaveBeenCalledWith({ type: SAVE_ROLE });
    });
  });
});
