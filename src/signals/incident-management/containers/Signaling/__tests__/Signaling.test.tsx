import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import signalsReopenRequestedReport from '../../../../../../internals/mocks/fixtures/report_signals-reopen-requested.json'
import signalsOpenReport from '../../../../../../internals/mocks/fixtures/report_signals-open.json'

import Signaling from '..'

import {
  fetchMock,
  server,
  rest,
  mockRequestHandler,
} from '../../../../../../internals/testing/msw-server'

fetchMock.disableMocks()

describe('<Signaling />', () => {
  it('should render data', async () => {
    render(withAppContext(<Signaling />))

    // Loading
    expect(screen.queryByTestId('graph-description')).not.toBeInTheDocument()
    expect(screen.getByTestId('loadingIndicator')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Signalering' })
    ).toBeInTheDocument()

    // Render data
    expect(await screen.findAllByText('13.000')).toHaveLength(2)
    expect(screen.getAllByText('Overig')).toHaveLength(2)
    expect(screen.getAllByText('Straatverlichting (VOR)')).toHaveLength(2)
    expect(screen.getAllByTestId('graph-description')).toHaveLength(2)
  })

  it('should render error notification', async () => {
    mockRequestHandler({
      status: 400,
      body: 'No users defined',
    })
    render(withAppContext(<Signaling />))

    // Loading
    expect(screen.queryByTestId('graph-description')).not.toBeInTheDocument()
    expect(screen.getByTestId('loadingIndicator')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Signalering' })
    ).toBeInTheDocument()

    // Render error
    expect(await screen.findByTestId('notification')).toHaveTextContent(
      'Er is iets misgegaan'
    )
    expect(screen.queryByText('13.000')).not.toBeInTheDocument()
  })

  it('fetches open signals up until today', async () => {
    let reqUrl = new URL('http://localhost:8000')

    server.use(
      rest.get(/reports\/signals\/open/, async (req, res, ctx) => {
        const response = await res(ctx.status(200), ctx.json(signalsOpenReport))
        reqUrl = req.url
        return response
      })
    )

    render(withAppContext(<Signaling />))

    await screen.findByTestId('signaling')

    const today = new Date()
    const end = new Date(reqUrl.searchParams.get('end') || '')

    expect(today.getDate()).toEqual(end.getDate())
    expect(today.getMonth()).toEqual(end.getMonth())
    expect(today.getFullYear()).toEqual(end.getFullYear())

    expect(reqUrl.searchParams.get('start')).toBeNull()
  })

  it('fetches reopen requests up until 14 days ago', async () => {
    let reqUrl = new URL('http://localhost:8000')

    server.use(
      rest.get(/reports\/signals\/reopen-requested/, async (req, res, ctx) => {
        const response = await res(
          ctx.status(200),
          ctx.json(signalsReopenRequestedReport)
        )
        reqUrl = req.url
        return response
      })
    )

    render(withAppContext(<Signaling />))

    await screen.findByTestId('signaling')

    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    const end = new Date(reqUrl.searchParams.get('end') || '')

    expect(twoWeeksAgo.getDate()).toEqual(end.getDate())
    expect(twoWeeksAgo.getMonth()).toEqual(end.getMonth())
    expect(twoWeeksAgo.getFullYear()).toEqual(end.getFullYear())

    expect(reqUrl.searchParams.get('start')).toBeNull()
  })
})
