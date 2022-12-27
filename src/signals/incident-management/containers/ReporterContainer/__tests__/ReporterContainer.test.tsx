// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021-2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import ReporterContainer from '..'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '4440' }),
}))

fetchMock.disableMocks()

describe('ReporterContainer', () => {
  it('renders loading indicator', () => {
    render(withAppContext(<ReporterContainer />))

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('should render correctly', async () => {
    render(withAppContext(<ReporterContainer />))

    expect(screen.getByTestId('reporter-container')).toBeInTheDocument()

    await screen.findByRole('link', { name: 'Terug naar melding' })
    screen.getByRole('heading', {
      name: 'Meldingen van me@email.com (2)',
    })
    screen.getByRole('link', { name: 'Hoofdmelding 4440' })

    expect(screen.getByTestId('incident-list')).toBeInTheDocument()
    expect(screen.getByTestId('incident-detail')).toBeInTheDocument()
  })
})
