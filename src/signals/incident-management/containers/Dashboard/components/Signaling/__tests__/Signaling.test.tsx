// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import signalsOpenReport from '../../../../../../../../internals/mocks/fixtures/report_signals-open.json'
import signalsReopenRequestedReport from '../../../../../../../../internals/mocks/fixtures/report_signals-reopen-requested.json'
import * as API from '../../../../../../../../internals/testing/api'
import {
  fetchMock,
  server,
  rest,
  mockRequestHandler,
} from '../../../../../../../../internals/testing/msw-server'
import Signaling from '../index'

fetchMock.disableMocks()

describe('<Signaling />', () => {
  it('should render data', async () => {
    render(withAppContext(<Signaling />))

    // Loading
    expect(screen.queryByTestId('graph-description')).not.toBeInTheDocument()
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()

    // Render data
    expect(await screen.findAllByText('13.000')).toHaveLength(2)
    expect(screen.getAllByText('Overig')).toHaveLength(2)
    expect(screen.getAllByText('Straatverlichting (VOR)')).toHaveLength(2)
    expect(screen.getAllByTestId('graph-description')).toHaveLength(2)
  })

  it('should render error notification', async () => {
    mockRequestHandler({
      url: API.REPORTS_OPEN,
      status: 400,
      body: 'No users defined',
    })
    render(withAppContext(<Signaling />))

    // Loading
    expect(screen.queryByTestId('graph-description')).not.toBeInTheDocument()
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()

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

    expect(reqUrl.searchParams.get('start')).toBeNull()
    expect(reqUrl.searchParams.get('end')).toBeNull()
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

    await waitFor(() => {
      render(withAppContext(<Signaling />))
    })

    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    const end = new Date(reqUrl.searchParams.get('end') || '')

    expect(twoWeeksAgo.getDate()).toEqual(end.getDate())
    expect(twoWeeksAgo.getMonth()).toEqual(end.getMonth())
    expect(twoWeeksAgo.getFullYear()).toEqual(end.getFullYear())

    expect(reqUrl.searchParams.get('start')).toBeNull()
  })
})
