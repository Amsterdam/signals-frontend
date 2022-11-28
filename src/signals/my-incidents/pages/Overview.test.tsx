// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { screen, render } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import { providerMock } from '../__test__'
import { MyIncidentsProvider } from '../context'
import { Overview } from './Overview'

jest.mock('../components', () => ({
  __esModule: true,
  ...jest.requireActual('../components'),
  IncidentsList: () => <div>[IncidentsList]</div>,
}))

describe('Overview', () => {
  it('should render correctly', () => {
    render(
      withAppContext(
        <MyIncidentsProvider value={providerMock}>
          <Overview />
        </MyIncidentsProvider>
      )
    )

    expect(screen.getByText('Mijn meldingen')).toBeInTheDocument()
    expect(screen.getByText('test@test.nl')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Dit zijn de meldingen die u de afgelopen 12 maanden heeft gemaakt:'
      )
    ).toBeInTheDocument()
  })
})
