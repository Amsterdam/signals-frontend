import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import roles from 'utils/__tests__/fixtures/roles.json';

import { RolesListContainer } from '..';

describe('signals/settings/roles/containers/RolesListContainer', () => {
  const props = {
    id: undefined,
    roles: {
      list: roles.list,
      permissions: [],
      loading: false,
      loadingPermissions: false,
    },
  };

  it('should lazy load correctly', () => {
    const loadingProps = {
      ...props,
      roles: {
        ...props.roles,
        loading: true,
      },
    };
    const { container, queryByTestId, rerender } = render(
      withAppContext(<RolesListContainer {...loadingProps} />)
    );

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument();
    expect(queryByTestId('rolesList')).not.toBeInTheDocument();

    const notLoadingProps = {
      ...props,
      roles: {
        ...props.roles,
        loading: false,
        loadingPermissions: false,
      },
    };
    rerender(withAppContext(<RolesListContainer {...notLoadingProps} />));

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument();
    expect(queryByTestId('rolesList')).toBeInTheDocument();

    expect(container.querySelector('h1')).toHaveTextContent(/^Rollen$/);
  });
});
