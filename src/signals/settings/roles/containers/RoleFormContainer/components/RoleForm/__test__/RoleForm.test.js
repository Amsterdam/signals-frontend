// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { render, fireEvent, act } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import { BASE_URL, ROLES_URL } from 'signals/settings/routes'
import { withAppContext } from 'test/utils'
import permissionsJson from 'utils/__tests__/fixtures/permissions.json'
import rolesJson from 'utils/__tests__/fixtures/roles.json'

import RoleForm from '..'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

describe('/signals/settings/roles/components/RoleForm', () => {
  const props = {
    role: rolesJson[0],
    permissions: permissionsJson,
    onPatchRole: jest.fn(),
    onSaveRole: jest.fn(),
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', () => {
    const { container, queryByTestId } = render(
      withAppContext(<RoleForm {...props} />)
    )

    expect(queryByTestId('roles-form-field-name')).toHaveValue('Behandelaar')

    expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(
      permissionsJson.length
    )

    expect(
      container.querySelectorAll('input[type="checkbox"]:checked').length
    ).toBe(6)
  })

  it('should show error in required name field', () => {
    const emptyNameProps = {
      ...props,
      role: {
        ...props.role,
        name: '',
      },
    }
    const { getByTestId, queryByTestId, queryByText } = render(
      withAppContext(<RoleForm {...emptyNameProps} />)
    )
    expect(queryByText('Dit veld is verplicht')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(getByTestId('submit-btn'), { preventDefault: jest.fn() })
    })

    expect(queryByTestId('roles-form-field-name')).toHaveValue('')
    expect(queryByText('Dit veld is verplicht')).toBeInTheDocument()

    const event = {
      target: {
        value: 'nieuwe Behandelaar',
      },
    }

    act(() => {
      fireEvent.change(getByTestId('roles-form-field-name'), event)
    })

    expect(queryByTestId('roles-form-field-name')).toHaveValue(
      'nieuwe Behandelaar'
    )
    expect(queryByText('Dit veld is verplicht')).toBeInTheDocument()

    act(() => {
      fireEvent.click(getByTestId('submit-btn'), { preventDefault: jest.fn() })
    })
    expect(queryByText('Dit veld is verplicht')).not.toBeInTheDocument()
  })

  it('should handle submit flow when patching an existing role', async () => {
    const { container, findByTestId, getByTestId } = render(
      withAppContext(<RoleForm {...props} />)
    )

    const event = {
      target: {
        value: 'Behandelaar',
      },
    }

    expect(props.onPatchRole).not.toHaveBeenCalled()

    act(() => {
      fireEvent.change(getByTestId('roles-form-field-name'), event)
      fireEvent.click(container.querySelectorAll('input[type="checkbox"]')[0])
    })

    await findByTestId('roles-form-field-name')

    act(() => {
      fireEvent.click(getByTestId('submit-btn'), { preventDefault: jest.fn() })
    })

    expect(props.onPatchRole).toHaveBeenCalledWith({
      id: 2,
      name: 'Behandelaar',
      permission_ids: [
        permissionsJson[0].id,
        ...rolesJson[0].permissions.map((p) => p.id),
      ],
    })

    act(() => {
      fireEvent.click(container.querySelectorAll('input[type="checkbox"]')[0])
    })

    await findByTestId('roles-form-field-name')

    act(() => {
      fireEvent.click(getByTestId('submit-btn'), { preventDefault: jest.fn() })
    })

    expect(props.onPatchRole).toHaveBeenCalledWith({
      id: 2,
      name: 'Behandelaar',
      permission_ids: [...rolesJson[0].permissions.map((p) => p.id)],
    })
  })

  it('should NOT submit when patching an existing role', () => {
    const { getByTestId } = render(
      withAppContext(<RoleForm {...props} readOnly />)
    )

    const event = {
      target: {
        value: 'Behandelaar',
      },
    }

    expect(props.onPatchRole).not.toHaveBeenCalled()

    act(() => {
      fireEvent.change(getByTestId('roles-form-field-name'), event)
      fireEvent.submit(document.forms[0], { preventDefault: jest.fn() })
    })

    expect(props.onPatchRole).not.toHaveBeenCalled()
  })

  it('should handle submit flow when saving a new role', () => {
    const noRoleProps = {
      ...props,
      role: undefined,
    }
    const { getByTestId } = render(
      withAppContext(<RoleForm {...noRoleProps} />)
    )

    const event = {
      target: {
        value: 'nieuwe Behandelaar',
      },
    }

    expect(props.onSaveRole).not.toHaveBeenCalled()

    act(() => {
      fireEvent.change(getByTestId('roles-form-field-name'), event)
      fireEvent.click(getByTestId('submit-btn'), { preventDefault: jest.fn() })
    })

    expect(props.onSaveRole).toHaveBeenCalledWith({
      name: 'nieuwe Behandelaar',
      permission_ids: [],
    })
  })

  it('should NOT submit when saving a new role', () => {
    const noRoleProps = {
      ...props,
      role: undefined,
    }
    const { getByTestId } = render(
      withAppContext(<RoleForm {...noRoleProps} readOnly />)
    )

    const event = {
      target: {
        value: 'nieuwe Behandelaar',
      },
    }

    expect(props.onSaveRole).not.toHaveBeenCalled()

    act(() => {
      fireEvent.change(getByTestId('roles-form-field-name'), event)
      fireEvent.submit(document.forms[0], { preventDefault: jest.fn() })
    })

    expect(props.onSaveRole).not.toHaveBeenCalled()
  })

  it('should not do submit when form is invalid', () => {
    const emptyNameProps = {
      ...props,
      role: {
        ...props.role,
        name: '',
      },
    }
    const { getByTestId } = render(
      withAppContext(<RoleForm {...emptyNameProps} />)
    )

    expect(props.onPatchRole).not.toHaveBeenCalled()
    expect(props.onSaveRole).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('submit-btn'), { preventDefault: jest.fn() })
    })

    expect(props.onPatchRole).not.toHaveBeenCalled()
    expect(props.onSaveRole).not.toHaveBeenCalled()
  })

  it('should handle cancel flow', () => {
    const navigateMock = jest.fn()
    jest
      .spyOn(reactRouterDom, 'useNavigate')
      .mockImplementation(() => navigateMock)

    const { getByTestId } = render(withAppContext(<RoleForm {...props} />))

    expect(props.onPatchRole).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('cancel-btn'))
    })

    expect(props.onPatchRole).not.toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith(`${BASE_URL}/${ROLES_URL}`)
  })
})
