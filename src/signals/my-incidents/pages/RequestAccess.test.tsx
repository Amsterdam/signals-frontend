// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import { providerMock } from '../__test__'
import { MyIncidentsProvider } from '../context'
import { RequestAccess } from './RequestAccess'

describe('RequestAccess', () => {
  it('should render correctly', () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <RequestAccess />
        </MyIncidentsProvider>
      )
    )

    expect(screen.getByText('Mijn meldingen')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Log in met het e-mailadres waarmee u medlingen maakt. U krijgt dan een bevestigingsmail om naar het meldingenoverzicht te gaan.'
      )
    ).toBeInTheDocument()
  })
})