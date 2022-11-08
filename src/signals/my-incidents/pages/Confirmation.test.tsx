// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { history, withAppContext } from 'test/utils'

import { MyIncidentsProvider } from '../context'
import { Confirmation } from './Confirmation'

jest.mock('../hooks', () => {
  const actual = jest.requireActual('../hooks')
  return {
    __esModule: true,
    ...actual,
    usePostEmail: () => [jest.fn(), 'rest'],
  }
})

const defaultValue = {
  email: 'test@test.nl',
  setEmail: jest.fn(),
}

describe('BasePage', () => {
  it('should render correctly', () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={defaultValue}>
          <Confirmation />
        </MyIncidentsProvider>
      )
    )

    expect(screen.getByText('Bevestig uw e-mailadres')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Wij hebben een e-mail verstuurd naar test@test.nl. Bevestig uw e-mailadres met de link in de e-mail. Het kan zijn dat de e-mail in uw spamfolder staat.'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Verstuur opnieuw' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Annuleren' })
    ).toBeInTheDocument()
  })

  it('should render different content when a user has clicked resend button', () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={defaultValue}>
          <Confirmation />
        </MyIncidentsProvider>
      )
    )

    const resendButton = screen.getByRole('button', {
      name: 'Verstuur opnieuw',
    })

    userEvent.click(resendButton)

    expect(screen.getByText('Opnieuw verstuurd')).toBeInTheDocument()
    expect(
      screen.getByText(
        `Wij hebben opnieuw een e-mail verstuurd naar test@test.nl. Bevestig uw e-mailadres met de link in de e-mail. Het kan zijn dat de e-mail in uw spamfolder staat.`
      )
    ).toBeInTheDocument()
  })

  it('should redirect to requestAccess page when email is undefined', () => {
    const value = {
      email: undefined,
      setEmail: jest.fn(),
    }

    render(
      withAppContext(
        <MyIncidentsProvider value={value}>
          <Confirmation />
        </MyIncidentsProvider>
      )
    )

    expect(history.location.pathname).toEqual('/mijn-meldingen/login')
  })
})
