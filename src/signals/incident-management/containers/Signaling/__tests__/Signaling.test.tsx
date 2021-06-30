import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import Signaling from '..'

import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../internals/testing/msw-server'

fetchMock.disableMocks()

describe('<Signaling />', () => {
  it('should render data', async () => {
    render(withAppContext(<Signaling />))

    // Loading
    expect(screen.getByTestId('loadingIndicator')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Signalering' })
    ).toBeInTheDocument()

    // Render data
    expect(await screen.findAllByText('13,000')).toHaveLength(2)
    expect(screen.getAllByText('Overig')).toHaveLength(2)
    expect(screen.getAllByText('Straatverlichting (VOR)')).toHaveLength(2)
  })

  it('should render error notification', async () => {
    mockRequestHandler({
      status: 400,
      body: 'No users defined',
    })
    render(withAppContext(<Signaling />))

    // Loading
    expect(screen.getByTestId('loadingIndicator')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Signalering' })
    ).toBeInTheDocument()

    // Render error
    expect(await screen.findByTestId('notification')).toHaveTextContent(
      'Er is iets misgegaan'
    )
    expect(screen.queryByText('13,000')).not.toBeInTheDocument()
  })
})
