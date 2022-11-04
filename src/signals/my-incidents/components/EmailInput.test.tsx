// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext, history } from 'test/utils'

import { MyIncidentsProvider } from '../context'
import { EmailInput } from './EmailInput'

let postEmail: jest.Mock

jest.mock('../hooks', () => {
  const actual = jest.requireActual('../hooks')
  return {
    __esModule: true,
    ...actual,
    usePostEmail: () => [(postEmail = jest.fn()), 'rest'],
  }
})

const defaultValue = {
  email: 'test@test.nl',
  setEmail: jest.fn(),
}

describe('EmailInput', () => {
  it('should render correctly', () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={defaultValue}>
          <EmailInput />
        </MyIncidentsProvider>
      )
    )

    expect(
      screen.getByRole('textbox', { name: 'E-mailadres' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Inloggen' })).toBeInTheDocument()
  })

  it('should submit email when submitting', async () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={defaultValue}>
          <EmailInput />
        </MyIncidentsProvider>
      )
    )

    const input = screen.getByRole('textbox', { name: 'E-mailadres' })

    userEvent.type(input, 'test@email.com')

    expect(screen.getByRole('textbox', { name: 'E-mailadres' })).toHaveValue(
      'test@email.com'
    )

    const submitButton = screen.getByRole('button', {
      name: 'Inloggen',
    })

    userEvent.click(submitButton)

    await waitFor(() => {
      expect(defaultValue.setEmail).toHaveBeenCalledWith('test@email.com')
      expect(postEmail).toHaveBeenCalledWith('test@email.com')
    })

    expect(history.location.pathname).toEqual('/mijn-meldingen/bevestig')
  })

  it('should display an error when email is invalid', async () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={defaultValue}>
          <EmailInput />
        </MyIncidentsProvider>
      )
    )

    const input = screen.getByRole('textbox', { name: 'E-mailadres' })

    userEvent.type(input, 'not-an-email')

    expect(screen.getByRole('textbox', { name: 'E-mailadres' })).toHaveValue(
      'not-an-email'
    )

    const submitButton = screen.getByRole('button', {
      name: 'Inloggen',
    })

    await waitFor(() => {
      userEvent.click(submitButton)
    })

    expect(
      screen.getByText('Het veld moet een geldig e-mailadres bevatten')
    ).toBeInTheDocument()

    userEvent.type(input, '@email.com')

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'E-mailadres' })).toHaveValue(
        'not-an-email@email.com'
      )
      expect(
        screen.queryByText('Het veld moet een geldig e-mailadres bevatten')
      ).not.toBeInTheDocument()
    })
  })
})
