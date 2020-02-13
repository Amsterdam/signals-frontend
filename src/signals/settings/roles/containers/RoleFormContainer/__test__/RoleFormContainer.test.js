import React from 'react';
import { render } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { withAppContext } from 'test/utils';
import roles from 'utils/__tests__/fixtures/roles.json';

import { PATCH_ROLE, SAVE_ROLE, RESET_RESPONSE } from 'models/roles/constants';
import { SHOW_GLOBAL_NOTIFICATION } from 'containers/App/constants';
import {
  VARIANT_ERROR,
  VARIANT_SUCCESS,
  TYPE_LOCAL,
} from 'containers/Notification/constants';
import routes from 'signals/settings/routes';

import { RoleFormContainer, mapDispatchToProps } from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    referrer: undefined,
  }),
}));

const mockRoleId = roleId => {
  jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
    roleId,
  }));
};

const push = jest.fn();
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({
  push,
}));

describe('signals/settings/roles/containers/RoleFormContainer', () => {
  beforeEach(() => {
    push.mockReset();
    props.showGlobalNotification.mockReset();
    props.onResetResponse.mockReset();
  });


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
    showGlobalNotification: jest.fn(),
    onResetResponse: jest.fn(),
    userCan: jest.fn(() => true),
  };

  it('should lazy load form correctly', () => {
    mockRoleId(undefined);

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
    mockRoleId('2');

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
    mockRoleId(undefined);

    const message = 'Rol toegevoegd';
    const propsWithSuccess = {
      ...props,
      roles: {
        ...props.roles,
        responseSuccess: true,
        responseError: false,
      },
    };

    expect(props.showGlobalNotification).not.toHaveBeenCalled();
    expect(props.onResetResponse).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    props.roles.responseSuccess = true;
    render(
      withAppContext(<RoleFormContainer {...propsWithSuccess} />)
    );

    expect(props.showGlobalNotification).toHaveBeenCalledWith({
      title: message,
      type: TYPE_LOCAL,
      variant: VARIANT_SUCCESS,
    });
    expect(props.onResetResponse).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining(routes.roles),
      expect.undefined,
    );
  });

  it('should show success message with existing role', () => {
    mockRoleId('2');

    const message = 'Gegevens opgeslagen';
    const propsWithSuccess = {
      ...props,
      roles: {
        ...props.roles,
        responseSuccess: true,
        responseError: false,
      },
    };

    expect(props.showGlobalNotification).not.toHaveBeenCalled();
    expect(props.onResetResponse).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    props.roles.responseSuccess = true;
    render(
      withAppContext(<RoleFormContainer {...propsWithSuccess} />)
    );

    expect(props.showGlobalNotification).toHaveBeenCalledWith({
      title: message,
      type: TYPE_LOCAL,
      variant: VARIANT_SUCCESS,
    });
    expect(props.onResetResponse).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining(routes.roles),
      expect.undefined,
    );
  });

  it('should show error message', () => {
    mockRoleId('2');

    const message = 'Er is iets mis gegaan bij het opslaan';
    const propsWithError = {
      ...props,
      roles: {
        ...props.roles,
        responseSuccess: false,
        responseError: true,
      },
    };

    expect(props.showGlobalNotification).not.toHaveBeenCalled();
    expect(props.onResetResponse).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    render(
      withAppContext(<RoleFormContainer {...propsWithError} />)
    );

    expect(props.showGlobalNotification).toHaveBeenCalledWith({
      title: message,
      type: TYPE_LOCAL,
      variant: VARIANT_ERROR,
    });
    expect(props.onResetResponse).toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
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

    it('onResetResponse', () => {
      mapDispatchToProps(dispatch).onResetResponse();
      expect(dispatch).toHaveBeenCalledWith({ type: RESET_RESPONSE });
    });

    it('showGlobalNotification', () => {
      mapDispatchToProps(dispatch).showGlobalNotification();
      expect(dispatch).toHaveBeenCalledWith({ type: SHOW_GLOBAL_NOTIFICATION });
    });
  });
});
