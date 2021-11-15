// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'
import { doLogin } from 'containers/App/actions'
import LoginPage from '.'

jest.mock('shared/services/configuration/configuration')
jest.mock('shared/services/auth/auth')
const mockUseDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockUseDispatch,
}))

describe('components/LoginPage', () => {
  afterEach(() => {
    jest.clearAllMocks()
    ;(configuration as any).__reset()
  })

  it('should render login button', () => {
    render(withAppContext(<LoginPage />))

    expect(
      screen.getByText('Om deze pagina te zien dient u ingelogd te zijn.')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Inloggen' })).toBeInTheDocument()
  })

  it('should login when Inloggen button is clicked', async () => {
    render(withAppContext(<LoginPage />))

    const button = screen.getByRole('button', { name: 'Inloggen' })
    userEvent.click(button)

    expect(mockUseDispatch).toHaveBeenCalledWith(doLogin())
  })
})
