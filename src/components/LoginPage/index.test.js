// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'
import * as auth from 'shared/services/auth/auth'
import LoginPage from '.'

jest.mock('shared/services/configuration/configuration')
jest.mock('shared/services/auth/auth')

describe('components/LoginPage', () => {
  afterEach(() => {
    jest.clearAllMocks()
    configuration.__reset()
  })

  it('should render login button', () => {
    render(withAppContext(<LoginPage />))

    expect(
      screen.getByText('Om deze pagina te zien dient u ingelogd te zijn.')
    ).toBeInTheDocument()
    expect(screen.getByText('Inloggen')).toBeInTheDocument()
  })

  it('should login when Inloggen button is clicked', () => {
    const loginSpy = jest.spyOn(auth, 'login')
    render(withAppContext(<LoginPage />))
    const button = screen.getByText('Inloggen').parentNode

    expect(button.getAttribute('type')).toEqual('button')

    userEvent.click(button)

    expect(loginSpy).toHaveBeenCalled()
  })
})
