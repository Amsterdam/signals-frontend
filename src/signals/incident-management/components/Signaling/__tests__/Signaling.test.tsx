// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react' // waitFor
import { http, HttpResponse } from 'msw'

import { withAppContext } from 'test/utils'

import * as API from '../../../../../../internals/testing/api'
import { server } from '../../../../../../internals/testing/msw-server'
import Signaling from '../index'

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
    server.use(
      http.get(API.REPORTS_OPEN, () =>
        HttpResponse.json('No users defined', { status: 400 })
      )
    )

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
      http.get(API.REPORTS_OPEN, ({ request }) => {
        reqUrl = new URL(request.url)

        return
      })
    )

    render(withAppContext(<Signaling />))

    expect(reqUrl.searchParams.get('start')).toBeNull()
    expect(reqUrl.searchParams.get('end')).toBeNull()
  })

  it('fetches reopen requests up until 14 days ago', async () => {
    let reqUrl = new URL('http://localhost:8000')

    server.use(
      http.get(API.REPORTS_REOPEN_REQUESTED, ({ request }) => {
        reqUrl = new URL(request.url)

        return
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
