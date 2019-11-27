import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import roles from 'utils/__tests__/fixtures/roles.json';

import { FETCH_ROLES, FETCH_PERMISSIONS, PATCH_ROLE } from 'models/roles/constants';
import { RoleFormContainer, mapDispatchToProps } from '..';

describe('signals/settings/roles/containers/RoleFormContainer', () => {
  let props = {};

  beforeEach(() => {
    props = {
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

  it('should lazy load form correctly', () => {
    props.roles.loadingPermissions = true;
    const { queryByTestId, rerender } = render(withAppContext(<RoleFormContainer {...props} />))

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();
    expect(queryByTestId('rolesForm')).not.toBeInTheDocument();

    props.roles.loading = false;
    props.roles.loadingPermissions = false;
    rerender(withAppContext(<RoleFormContainer {...props} />))

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
    expect(queryByTestId('rolesForm')).toBeInTheDocument();
  });

  it('should fetch roles and permissions by default', () => {
    render(withAppContext(<RoleFormContainer {...props} />))

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
