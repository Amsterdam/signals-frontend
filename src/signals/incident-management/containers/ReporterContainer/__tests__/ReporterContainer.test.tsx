// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
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

    expect(screen.getByTestId('loadingIndicator')).toBeInTheDocument()
  })

  it('should render correctly', async () => {
    render(withAppContext(<ReporterContainer />))

    await screen.findByRole('link', { name: 'Terug naar melding' })
    screen.getByRole('heading', {
      name: 'Meldingen van me@email.com (2)',
    })
    screen.getByRole('link', { name: 'Hoofdmelding 4440' })
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
