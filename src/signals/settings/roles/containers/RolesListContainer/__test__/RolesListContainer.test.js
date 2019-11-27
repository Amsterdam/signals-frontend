import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import roles from 'utils/__tests__/fixtures/roles.json';

import { FETCH_ROLES, RESET_RESONSE } from 'models/roles/constants';
import { RolesListContainer, mapDispatchToProps } from '..';

describe('signals/settings/roles/containers/RolesListContainer', () => {
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
      onResetResponse: jest.fn(),
    };
  });


  it('should lazy load correctly', () => {
    props.roles.loading = true;
    const { container, queryByTestId, rerender } = render(withAppContext(<RolesListContainer {...props} />))

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();
    expect(queryByTestId('rolesList')).not.toBeInTheDocument();

    props.roles.loading = false;
    props.roles.loadingPermissions = false;
    rerender(withAppContext(<RolesListContainer {...props} />))

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
    expect(queryByTestId('rolesList')).toBeInTheDocument();

    expect(container.querySelector('h1')).toHaveTextContent(/^Rollen$/);
  });

  it('should fetch roles and permissions by default', () => {
    render(withAppContext(<RolesListContainer {...props} />))

    expect(props.onFetchRoles).toHaveBeenCalled();
    expect(props.onResetResponse).toHaveBeenCalled();
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('onRequestIncident', () => {
      mapDispatchToProps(dispatch).onFetchRoles();
      expect(dispatch).toHaveBeenCalledWith({ type: FETCH_ROLES });
    });

    it('onResetResponse', () => {
      mapDispatchToProps(dispatch).onResetResponse();
      expect(dispatch).toHaveBeenCalledWith({ type: RESET_RESONSE });
    });
  });
});
