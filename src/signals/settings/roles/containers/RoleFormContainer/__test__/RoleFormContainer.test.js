// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { render } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import { VARIANT_SUCCESS, TYPE_LOCAL } from 'containers/Notification/constants'
import routes, { BASE_URL } from 'signals/settings/routes'
import { withAppContext } from 'test/utils'
import rolesJson from 'utils/__tests__/fixtures/roles.json'

import { RoleFormContainer } from '..'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    referrer: undefined,
  }),
}))

const navigateMock = jest.fn()
const roleId = '2'

describe('signals/settings/roles/containers/RoleFormContainer', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    jest
      .spyOn(reactRouterDom, 'useNavigate')
      .mockImplementation(() => navigateMock)

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      roleId,
    }))
  })

  const props = {
    roles: {
      list: rolesJson,
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
  }

  it('should lazy load form correctly', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      roleId: undefined,
    }))

    const loadingProps = {
      ...props,
      roles: {
        ...props.roles,
        loading: true,
      },
    }
    const { container, queryByTestId, rerender } = render(
      withAppContext(<RoleFormContainer {...loadingProps} />)
    )

    expect(queryByTestId('loading-indicator')).toBeInTheDocument()
    expect(queryByTestId('roles-form')).not.toBeInTheDocument()

    const notLoadingProps = {
      ...props,
      roles: {
        ...props.roles,
        loading: false,
        loadingPermissions: false,
      },
    }
    rerender(withAppContext(<RoleFormContainer {...notLoadingProps} />))

    expect(queryByTestId('loading-indicator')).not.toBeInTheDocument()
    expect(queryByTestId('roles-form')).toBeInTheDocument()
    expect(container.querySelector('h1')).toHaveTextContent(/^Rol toevoegen$/)
  })

  it('should load form with existing role correctly', () => {
    const notLoadingProps = {
      ...props,
      roles: {
        ...props.roles,
        loading: false,
        loadingPermissions: false,
      },
    }
    const { container, queryByTestId } = render(
      withAppContext(<RoleFormContainer {...notLoadingProps} />)
    )

    expect(queryByTestId('roles-form')).toBeInTheDocument()
    expect(container.querySelector('h1')).toHaveTextContent(/^Rol wijzigen$/)
  })

  it('should show success notication and navigate to role list page', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      roleId: undefined,
    }))

    const message = 'Rol toegevoegd'
    const propsWithSuccess = {
      ...props,
      roles: {
        ...props.roles,
        responseSuccess: true,
        responseError: false,
      },
    }

    expect(props.showGlobalNotification).not.toHaveBeenCalled()
    expect(props.onResetResponse).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()

    props.roles.responseSuccess = true
    render(withAppContext(<RoleFormContainer {...propsWithSuccess} />))

    expect(props.showGlobalNotification).toHaveBeenCalledWith({
      title: message,
      type: TYPE_LOCAL,
      variant: VARIANT_SUCCESS,
    })
    expect(props.onResetResponse).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith(`${BASE_URL}/${routes.roles}`)
  })

  it('should show success notication and navigate to role list page with existing role', () => {
    const message = 'Gegevens opgeslagen'
    const propsWithSuccess = {
      ...props,
      roles: {
        ...props.roles,
        responseSuccess: true,
        responseError: false,
      },
    }

    expect(props.showGlobalNotification).not.toHaveBeenCalled()
    expect(props.onResetResponse).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()

    props.roles.responseSuccess = true
    render(withAppContext(<RoleFormContainer {...propsWithSuccess} />))

    expect(props.showGlobalNotification).toHaveBeenCalledWith({
      title: message,
      type: TYPE_LOCAL,
      variant: VARIANT_SUCCESS,
    })
    expect(props.onResetResponse).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith(`${BASE_URL}/${routes.roles}`)
  })

  it('should show error notication and not navigate to role list page', () => {
    const propsWithError = {
      ...props,
      roles: {
        ...props.roles,
        responseSuccess: false,
        responseError: true,
      },
    }

    expect(props.showGlobalNotification).not.toHaveBeenCalled()
    expect(props.onResetResponse).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()

    render(withAppContext(<RoleFormContainer {...propsWithError} />))

    expect(props.onResetResponse).toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
