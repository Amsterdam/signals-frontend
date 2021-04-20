// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react'
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import rolesJson from 'utils/__tests__/fixtures/roles.json'

import { RolesListContainer } from '..'

describe('signals/settings/roles/containers/RolesListContainer', () => {
  const props = {
    id: undefined,
    roles: {
      list: rolesJson,
      permissions: [],
      loading: false,
      loadingPermissions: false,
    },
    userCan: jest.fn(() => true),
  }

  it('should lazy load correctly', () => {
    const loadingProps = {
      ...props,
      roles: {
        ...props.roles,
        loading: true,
      },
    }
    const { container, queryByTestId, rerender } = render(
      withAppContext(<RolesListContainer {...loadingProps} />)
    )

    expect(queryByTestId('loadingIndicator')).toBeInTheDocument()
    expect(queryByTestId('rolesList')).not.toBeInTheDocument()

    const notLoadingProps = {
      ...props,
      roles: {
        ...props.roles,
        loading: false,
        loadingPermissions: false,
      },
    }
    rerender(withAppContext(<RolesListContainer {...notLoadingProps} />))

    expect(queryByTestId('loadingIndicator')).not.toBeInTheDocument()
    expect(queryByTestId('rolesList')).toBeInTheDocument()

    expect(container.querySelector('h1')).toHaveTextContent(/^Rollen$/)
  })

  it('should render an "Add group" button', () => {
    const { queryByText, rerender } = render(
      withAppContext(<RolesListContainer {...props} />)
    )

    expect(queryByText('Rol toevoegen')).toBeInTheDocument()

    rerender(
      withAppContext(<RolesListContainer {...props} userCan={() => false} />)
    )

    expect(queryByText('Rol toevoegen')).not.toBeInTheDocument()
  })
})
