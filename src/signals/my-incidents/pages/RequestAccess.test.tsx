// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import { MyIncidentsProvider } from '../context'
import { RequestAccess } from './RequestAccess'

const defaultValue = {
  email: 'test@test.nl',
  setEmail: jest.fn(),
}

describe('RequestAccess', () => {
  it('should render correctly', () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={defaultValue}>
          <RequestAccess />
        </MyIncidentsProvider>
      )
    )

    expect(screen.getByText('Mijn meldingen')).toBeInTheDocument()
    expect(
      screen.getByText(
        'De link om uw aanmelding te bevestigen is verlopen. Begin opnieuw om een nieuwe bevestigingslink te ontvangen.'
      )
    ).toBeInTheDocument()
  })
})
