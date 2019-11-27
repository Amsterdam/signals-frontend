import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import roles from 'utils/__tests__/fixtures/roles.json';

import { FETCH_ROLES, FETCH_PERMISSIONS, PATCH_ROLE } from 'models/roles/constants';
import { RolesListContainer, mapDispatchToProps } from '..';

describe('signals/settings/roles/components/RolesOverview', () => {
  let props = {};

  beforeEach(() => {
    props = {
      id: undefined,
      roles: {
        list: roles.list,
        permissions: [],
        loading: false,
        loadingPermissions: false,
      },
      onFetchRoles: jest.fn(),
      onFetchPermissions: jest.fn(),
      onPatchRole: jest.fn(),
    };
  });


  it('should lazy load list correctly', () => {
    props.roles.loading = true;
    const { queryByTestId, rerender } = render(withAppContext(<RolesListContainer {...props} />))

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();
    expect(queryByTestId('rolesList')).not.toBeInTheDocument();
    expect(queryByTestId('rolesForm')).not.toBeInTheDocument();

    props.roles.loading = false;
    props.roles.loadingPermissions = false;
    rerender(withAppContext(<RolesListContainer {...props} />))

    expect(queryByTestId('rolesList')).toBeInTheDocument();
    expect(queryByTestId('rolesForm')).not.toBeInTheDocument();
  });

  it('should lazy load form correctly', () => {
    props.id = '3';
    props.roles.loadingPermissions = true;
    const { queryByTestId, rerender } = render(withAppContext(<RolesListContainer {...props} />))

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();
    expect(queryByTestId('rolesList')).not.toBeInTheDocument();
    expect(queryByTestId('rolesForm')).not.toBeInTheDocument();

    props.roles.loading = false;
    props.roles.loadingPermissions = false;
    rerender(withAppContext(<RolesListContainer {...props} />))

    expect(queryByTestId('rolesList')).not.toBeInTheDocument();
    expect(queryByTestId('rolesForm')).toBeInTheDocument();
  });

  it('should fetch roles and permissions by default', () => {
    render(withAppContext(<RolesListContainer {...props} />))

    expect(props.onFetchRoles).toHaveBeenCalled();
    expect(props.onFetchPermissions).toHaveBeenCalled();
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      mapDispatchToProps(dispatch).onFetchRoles();
      expect(dispatch).toHaveBeenCalledWith({ type: FETCH_ROLES });
    });

    it('onRequestIncident', () => {
      mapDispatchToProps(dispatch).onFetchPermissions();
      expect(dispatch).toHaveBeenCalledWith({ type: FETCH_PERMISSIONS });
    });

    it('onPatchRole', () => {
      mapDispatchToProps(dispatch).onPatchRole();
      expect(dispatch).toHaveBeenCalledWith({ type: PATCH_ROLE });
    });
  });
});
