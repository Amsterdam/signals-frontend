// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext, history } from 'test/utils'

import { providerMock } from '../../__test__'
import { MyIncidentsProvider } from '../../context'
import { EmailInput } from './EmailInput'

describe('EmailInput', () => {
  it('should render correctly', () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <EmailInput />
        </MyIncidentsProvider>
      )
    )

    expect(screen.getByText('E-mailadres')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Inloggen' })).toBeInTheDocument()
  })

  it('should submit email when submitting', async () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <EmailInput />
        </MyIncidentsProvider>
      )
    )

    const input = screen.getByRole('textbox')

    userEvent.type(input, 'test@email.com')

    expect(screen.getByRole('textbox')).toHaveValue('test@email.com')

    const submitButton = screen.getByRole('button', {
      name: 'Inloggen',
    })

    await waitFor(() => {
      userEvent.click(submitButton)
    })

    expect(providerMock.setEmail).toHaveBeenCalledWith('test@email.com')
    expect(history.location.pathname).toEqual('/mijn-meldingen/bevestig')
  })

  it('should display an error when email is invalid', async () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <EmailInput />
        </MyIncidentsProvider>
      )
    )

    const input = screen.getByRole('textbox')

    userEvent.type(input, 'myemail')

    expect(screen.getByRole('textbox')).toHaveValue('myemail')

    const submitButton = screen.getByRole('button', {
      name: 'Inloggen',
    })

    await waitFor(() => {
      userEvent.click(submitButton)
    })

    expect(
      screen.getByText('Het veld moet een geldig e-mailadres bevatten')
    ).toBeInTheDocument()

    await waitFor(() => {
      userEvent.type(input, '@email.com')
    })

    expect(screen.getByRole('textbox')).toHaveValue('myemail@email.com')
    expect(
      screen.queryByText('Het veld moet een geldig e-mailadres bevatten')
    ).not.toBeInTheDocument()
  })
})
