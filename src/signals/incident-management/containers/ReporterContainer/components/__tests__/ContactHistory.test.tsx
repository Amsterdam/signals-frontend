// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import * as reactRedux from 'react-redux'
import { showGlobalNotification } from 'containers/App/actions'
import { withAppContext } from 'test/utils'

import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../../internals/testing/msw-server'

import ContactHistory from '../ContactHistory'

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

describe('ContactHistory', () => {
  beforeAll(() => {
    fetchMock.disableMocks()
  })

  afterEach(() => {
    dispatch.mockReset()
  })

  it('renders loading indicator', () => {
    render(withAppContext(<ContactHistory id={4440} />))

    expect(screen.getByTestId('loadingIndicator')).toBeInTheDocument()
  })

  it('renders an error response', async () => {
    mockRequestHandler({
      status: 500,
      body: 'Internal server error',
    })

    render(withAppContext(<ContactHistory id={4440} />))

    await waitFor(() =>
      expect(screen.queryByTestId('loadingIndicator')).not.toBeInTheDocument()
    )

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification(
        expect.objectContaining({
          title:
            'De data kon niet opgehaald worden. probeer het later nog eens.',
        })
      )
    )
  })

  it('renders a list of history items', async () => {
    render(withAppContext(<ContactHistory id={4440} />))

    await screen.findByRole('list')

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('handles empty contact history', async () => {
    mockRequestHandler({ body: [] })
    render(withAppContext(<ContactHistory id={4440} />))

    expect(
      await screen.findByText('Er is nog geen contact geweest met deze melder')
    ).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
